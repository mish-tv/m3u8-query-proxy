import HLS from "hls-parser";
import * as path from "path";

const isMasterPlaylist = (playlist: HLS.types.MasterPlaylist | HLS.types.MediaPlaylist): playlist is HLS.types.MasterPlaylist =>
  playlist.isMasterPlaylist;

export const convertPlaylist = (
  playlist: HLS.types.MasterPlaylist | HLS.types.MediaPlaylist,
  m3u8Origin: string,
  requestURL: string,
) => {
  const [requestPath, rawQuery]: Nullable<string>[] = requestURL.split("?");

  if (isMasterPlaylist(playlist)) {
    if (rawQuery == undefined) return;
    for (const variant of playlist.variants) {
      variant.uri = `${variant.uri}?${rawQuery}`;
      for (const audio of variant.audio) {
        if (audio.uri != undefined) audio.uri = `${audio.uri}?${rawQuery}`;
      }
    }
  } else {
    const basePath = path.dirname(requestPath);
    const converted: Set<unknown> = new Set();
    const convertURI = (() => {
      if (rawQuery == undefined) {
        return (obj: { uri: string }) => {
          if (converted.has(obj)) return;
          obj.uri = new URL(path.join(basePath, obj.uri), m3u8Origin).toString();
          converted.add(obj);
        };
      }

      return (obj: { uri: string }) => {
        if (converted.has(obj)) return;
        obj.uri = new URL(`${path.join(basePath, obj.uri)}?${rawQuery}`, m3u8Origin).toString();
        converted.add(obj);
      };
    })();
    for (const segment of playlist.segments) {
      convertURI(segment);
      if (segment.map != undefined) {
        convertURI(segment.map);
      }
    }
  }
};
