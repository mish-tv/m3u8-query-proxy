import { createServer, RequestListener, ServerResponse } from "http";
import { logger } from "@mish-tv/stackdriver-logger";
import fetch from "node-fetch";
import HLS from "hls-parser";

import { createPathConverter } from "./path-converter";
import { convertPlaylist } from "./convert-playlist";

const getEnv = (key: string) =>
  process.env[key] ??
  (() => {
    throw new Error(`${key} must be set`);
  })();
const m3u8Origin = getEnv("M3U8_ORIGIN");
const proxyHeaders = [
  "content-type",
  "set-cookie",
  "access-control-max-age",
  "access-control-allow-credentials",
  "access-control-expose-headers",
  "access-control-allow-headers",
  "access-control-allow-methods",
  "access-control-allow-origin",
];

const convertPath = createPathConverter(process.env["REMOVE_PATH_PREFIX"]);

const writeOriginPlaylist = async (requestURL: string, response: ServerResponse) => {
  const requestPath = convertPath(requestURL);
  if (requestPath == undefined) {
    logger.warning("invalid path", { requestURL, requestPath });
    response.statusCode = 400;
    response.end();

    return;
  }
  const originResponse = await fetch(new URL(requestPath, m3u8Origin).toString());
  const body = await originResponse.text();
  if (originResponse.status !== 200) {
    logger.warning(body, { requestURL, requestPath });
    response.statusCode = originResponse.status;
    response.end();

    return;
  }

  const playlist = (() => {
    try {
      return HLS.parse(body);
    } catch (e) {
      logger.warning(body, { requestURL, requestPath, e });
      response.statusCode = 400;
      response.end();
    }
  })();
  if (playlist == undefined) return;
  convertPlaylist(playlist, m3u8Origin, requestPath);

  for (const key of proxyHeaders) {
    const value = originResponse.headers.get(key);
    if (value == undefined) continue;
    response.setHeader(key, value);
  }
  response.end(HLS.stringify(playlist));
};

const listener: RequestListener = (request, response) => {
  request
    .on("error", (e) => {
      logger.error(e);
      response.statusCode = 400;
      response.end();
    })
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .on("data", () => {})
    .on("end", async () => {
      try {
        if (request.url == undefined) throw new Error("url is undefined");
        response.statusCode = 200;
        await writeOriginPlaylist(request.url, response);
      } catch (e) {
        logger.error(e);
        response.statusCode = 500;
        response.end("Internal Server Error");
      }
    });
};

const server = createServer(listener);
const port = process.env["PORT"] ?? "8080";
server.listen(Number(port), () => {
  console.debug(`Listening and serving HTTP on :${port}`);
});
