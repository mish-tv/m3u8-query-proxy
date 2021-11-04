<h1 align="center">@mish-tv/m3u8-query-proxy</h1>

<div align="center">
<a href="https://www.npmjs.com/package/@mish-tv/m3u8-query-proxy"><img src="https://img.shields.io/npm/v/@mish-tv/m3u8-query-proxy.svg" alt="npm"></a>
<a href="https://github.com/mish-tv/m3u8-query-proxy/actions/workflows/build-and-test.yml"><img src="https://github.com/mish-tv/m3u8-query-proxy/actions/workflows/build-and-test.yml/badge.svg" alt="Build and test"></a>
<a href="https://codecov.io/gh/mish-tv/m3u8-query-proxy"><img src="https://img.shields.io/codecov/c/github/mish-tv/m3u8-query-proxy.svg" alt="coverage"></a>
<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/github/license/mish-tv/m3u8-query-proxy.svg?style=flat" alt="license"></a>
</div>

<h4 align="center">`@mish-tv/m3u8-query-proxy` is a proxy server that adds a query to the value of a URI.</h4>
<p>This is designed to be used to give CDN authentication tokens when playing hls in iOS browsers.</p>

## Usage
```
npm install -g @mish-tv/m3u8-query-proxy@0.0.1
M3U8_ORIGIN="https://cdn.example.com" m3u8-query-proxy
curl http://localhost:8080/foo/bar.m3u8?token=baz
```

If you make a request as shown above, the proxy will request to https://cdn.example.com/foo/bar.m3u8?token=baz.  
It will rewrite the response as needed.  
Refer to [the test](https://github.com/mish-tv/m3u8-query-proxy/blob/main/src/convert-playlist.spec.ts) to see how to rewrite the response.
