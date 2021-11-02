import HLS from "hls-parser";

import { convertPlaylist } from "./convert-playlist";

type TestCase = {
  requestURL: string;
  input: string;
  expected: string;
};

const test = ({ requestURL, input, expected }: TestCase) => {
  const playlist = HLS.parse(input);
  convertPlaylist(playlist, "http://example.com", requestURL);
  const output = HLS.stringify(playlist);
  expect(output).toBe(expected);
};

const testCases: TestCase[] = [
  {
    requestURL: "/foo/video.m3u8?baz=hoge&fuga=piyo",
    input: `#EXTM3U
#EXT-X-VERSION:6
#EXT-X-INDEPENDENT-SEGMENTS
#EXT-X-STREAM-INF:BANDWIDTH=2350291,AVERAGE-BANDWIDTH=1838189,VIDEO-RANGE=SDR,CODECS="avc1.4d4028,mp4a.40.2",RESOLUTION=1920x1080,FRAME-RATE=30.000,AUDIO="program_audio_0"
video1080p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=254682,AVERAGE-BANDWIDTH=244886,VIDEO-RANGE=SDR,CODECS="avc1.4d4015,mp4a.40.2",RESOLUTION=428x240,FRAME-RATE=30.000,AUDIO="program_audio_0"
video240p.m3u8
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="program_audio_0",LANGUAGE="eng",NAME="Alternate Audio",AUTOSELECT=YES,DEFAULT=YES,URI="videoaudio.m3u8"`,
    expected: `#EXTM3U
#EXT-X-VERSION:6
#EXT-X-INDEPENDENT-SEGMENTS
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="program_audio_0",NAME="Alternate Audio",DEFAULT=YES,AUTOSELECT=YES,LANGUAGE="eng",URI="videoaudio.m3u8?baz=hoge&fuga=piyo"
#EXT-X-STREAM-INF:BANDWIDTH=2350291,AVERAGE-BANDWIDTH=1838189,CODECS="avc1.4d4028,mp4a.40.2",RESOLUTION=1920x1080,FRAME-RATE=30.000,AUDIO="program_audio_0",VIDEO-RANGE=SDR
video1080p.m3u8?baz=hoge&fuga=piyo
#EXT-X-STREAM-INF:BANDWIDTH=254682,AVERAGE-BANDWIDTH=244886,CODECS="avc1.4d4015,mp4a.40.2",RESOLUTION=428x240,FRAME-RATE=30.000,AUDIO="program_audio_0",VIDEO-RANGE=SDR
video240p.m3u8?baz=hoge&fuga=piyo`,
  },
  {
    requestURL: "/video.m3u8",
    input: `#EXTM3U
#EXT-X-VERSION:6
#EXT-X-INDEPENDENT-SEGMENTS
#EXT-X-STREAM-INF:BANDWIDTH=2350291,AVERAGE-BANDWIDTH=1838189,VIDEO-RANGE=SDR,CODECS="avc1.4d4028,mp4a.40.2",RESOLUTION=1920x1080,FRAME-RATE=30.000,AUDIO="program_audio_0"
video1080p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=254682,AVERAGE-BANDWIDTH=244886,VIDEO-RANGE=SDR,CODECS="avc1.4d4015,mp4a.40.2",RESOLUTION=428x240,FRAME-RATE=30.000,AUDIO="program_audio_0"
video240p.m3u8
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="program_audio_0",LANGUAGE="eng",NAME="Alternate Audio",AUTOSELECT=YES,DEFAULT=YES,URI="videoaudio.m3u8"`,
    expected: `#EXTM3U
#EXT-X-VERSION:6
#EXT-X-INDEPENDENT-SEGMENTS
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="program_audio_0",NAME="Alternate Audio",DEFAULT=YES,AUTOSELECT=YES,LANGUAGE="eng",URI="videoaudio.m3u8"
#EXT-X-STREAM-INF:BANDWIDTH=2350291,AVERAGE-BANDWIDTH=1838189,CODECS="avc1.4d4028,mp4a.40.2",RESOLUTION=1920x1080,FRAME-RATE=30.000,AUDIO="program_audio_0",VIDEO-RANGE=SDR
video1080p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=254682,AVERAGE-BANDWIDTH=244886,CODECS="avc1.4d4015,mp4a.40.2",RESOLUTION=428x240,FRAME-RATE=30.000,AUDIO="program_audio_0",VIDEO-RANGE=SDR
video240p.m3u8`,
  },
  {
    requestURL: "/foo/video.m3u8?baz=hoge&fuga=piyo",
    input: `#EXTM3U
#EXT-X-VERSION:6
#EXT-X-TARGETDURATION:11
#EXT-X-MEDIA-SEQUENCE:1
#EXT-X-PLAYLIST-TYPE:VOD
#EXT-X-MAP:URI="video240p.cmfv",BYTERANGE="1566@0"
#EXTINF:10,
#EXT-X-BYTERANGE:140787@1566
video240p.cmfv
#EXTINF:8,
#EXT-X-BYTERANGE:75730@1561297
video240p.cmfv
#EXT-X-ENDLIST`,
    expected: `#EXTM3U
#EXT-X-VERSION:6
#EXT-X-TARGETDURATION:11
#EXT-X-MEDIA-SEQUENCE:1
#EXT-X-PLAYLIST-TYPE:VOD
#EXT-X-MAP:URI="http://example.com/foo/video240p.cmfv?baz=hoge&fuga=piyo",BYTERANGE="1566@0"
#EXTINF:10,
#EXT-X-BYTERANGE:140787@1566
http://example.com/foo/video240p.cmfv?baz=hoge&fuga=piyo
#EXTINF:8,
#EXT-X-BYTERANGE:75730@1561297
http://example.com/foo/video240p.cmfv?baz=hoge&fuga=piyo
#EXT-X-ENDLIST`,
  },
  {
    requestURL: "/video.m3u8",
    input: `#EXTM3U
#EXT-X-VERSION:6
#EXT-X-TARGETDURATION:11
#EXT-X-MEDIA-SEQUENCE:1
#EXT-X-PLAYLIST-TYPE:VOD
#EXT-X-MAP:URI="video240p.cmfv",BYTERANGE="1566@0"
#EXTINF:10,
#EXT-X-BYTERANGE:140787@1566
video240p.cmfv
#EXTINF:8,
#EXT-X-BYTERANGE:75730@1561297
video240p.cmfv
#EXT-X-ENDLIST`,
    expected: `#EXTM3U
#EXT-X-VERSION:6
#EXT-X-TARGETDURATION:11
#EXT-X-MEDIA-SEQUENCE:1
#EXT-X-PLAYLIST-TYPE:VOD
#EXT-X-MAP:URI="http://example.com/video240p.cmfv",BYTERANGE="1566@0"
#EXTINF:10,
#EXT-X-BYTERANGE:140787@1566
http://example.com/video240p.cmfv
#EXTINF:8,
#EXT-X-BYTERANGE:75730@1561297
http://example.com/video240p.cmfv
#EXT-X-ENDLIST`,
  },
];

describe("convertPlaylist", () => {
  it("adds the query etc. to the URI value.", () => testCases.forEach(test));
});
