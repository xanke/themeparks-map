export const THEMEPARKS = [
  {
    label: 'Shanghai Disney Resort',
    value: 'shdr',
    tags: ['disneypand'],
    crs: 'baidu',
    layerUrl: '/shdr/media/maps/prod/shdr-baidu/740479929/{z}/{x}/{y}.jpg',
    versions: ['611231269', '740479929'],
    center: [31.1492, 121.6667]
  },
  {
    label: 'Hong Kong Disneyland Resort',
    value: 'hkdl',
    tags: ['disneypand'],
    layerUrl: 'https://cdn6.parksmedia.wdprapps.disney.com/media/maps/prod/hkdl/35/{z}/{x}/{y}.jpg',
    center: [22.3130715, 114.0410932]
  },
  {
    label: 'California Disneyland Park',
    value: 'california',
    tags: ['disneypand'],
    layerUrl: 'https://secure.parksandresorts.wdpromedia.com/media/maps/prod/disneyland/538595539/{z}/{x}/{y}.jpg',
    center: [33.811883, -117.91894],
    versions: [96, 538595539]
  },
  {
    label: 'Paris Disneyland',
    value: 'paris',
    tags: ['disneypand'],
    layerUrl: 'https://media.disneylandparis.com/mapTiles/images/{z}/{x}/{y}.jpg',
    center: [48.8722379, 2.7736192]
  },
  {
    label: 'Orlando Disney World',
    value: 'orlando',
    tags: ['disneypand'],
    layerUrl: 'https://cdn6.parksmedia.wdprapps.disney.com/media/maps/prod/wdw/677296982/{z}/{x}/{y}.jpg',
    versions: [165, 677296982],
    center: [28.418862, -81.581254]
  },
  {
    label: 'Tokyo Disney Resort',
    value: 'tokyo',
    tags: ['disneypand'],
    layerUrl: '/tkydl/limited/map-image/20250623170000/daytime/z{z}/{x}_{y}.jpg',
    versions: ['20210210110000', '20250623170000'],
    center: [ 35.631777, 139.881632]
  },
  {
    label: 'Tokyo Disney Resort - Night',
    value: 'tokyoNight',
    tags: ['disneypand'],
    layerUrl: '/tkydl/limited/map-image/20250623170000/nighttime/z{z}/{x}_{y}.jpg',
    versions: ['20210210110000', '20250623170000'],
    center: [ 35.631777, 139.881632]
  },
  {
    label: 'Shanghai Lego Resort',
    value: 'shll',
    crs: 'tent',
    tags: ['legoland'],
    layerUrl: 'https://tencent-web-1320474462.cos.ap-shanghai.myqcloud.com/lego//map/tiles/{z}/{x}_{y}.jpg',
    versions: [],
    center: [ 30.891576, 121.105336]
  },
  {
    label: 'USJ',
    value: 'usj',
    layerUrl: 'https://mobile-service.usj.co.jp/assets/MapTiles/Production/30039/512/{z}_{x}_{y}.jpg',
    versions: [],
    center:  [34.665732, 135.432105]
  },
  {
    label: 'USF',
    value: 'usf',
    layerUrl: 'https://services.universalorlando.com/api/MapTiles/10255/512/{z}/{x}/{y}',
    versions: [],
    center:  [28.478979, -81.468522]
  },
  // CloudFront-Signature=IRbWVuDNl6Y5DeyTJtG5LB2vcKrCiK~8dOo4A06GAYRWFsTYsCG5iB90a~X8OyQ123A4dD0u3piTyJy4pt8Fs0RoPR1GBi9XS2pGpmvUalWp91JWgZZ9QLHc97bFfZTRLTUsdm~6BNZketgHFFrqeQOFH2Whw2Sx1txj5DBlx0eHqBl3qZ2smmG8xZJzH6v7cFvFAuJuATQbCAG3ui2~vFkyv~GRJZYQQkOWrlat2fIBO~yQNR05TmmjFrwLBNSeChRtEjCx0Gu8YpC5HzxilVPZDeefVWnREx1yuTMyvRvd5h6eooA8SYFHsrDbPG4gz0WBdMpNoLCjicjz6BvwTQ__;CloudFront-Key-Pair-Id=APKAIJUGP2GGEWDAPMTQ;CloudFront-Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6Imh0dHBzOi8vY29udGVudHMtcG9ydGFsLnRva3lvZGlzbmV5cmVzb3J0LmpwLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2MTkyNjEzMjd9LCJJcEFkZHJlc3MiOnsiQVdTOlNvdXJjZUlwIjoiMC4wLjAuMC8wIn19fV19
  // https://contents-portal.tokyodisneyresort.jp/limited/map-image/20210210110000/nighttime/z17/116464_51633.jpg
  // {
  //   label: '北京环球影城',
  //   value: 'bj',
  //   crs: 'baidu',
  //   tags: [''],
  //   layerUrl: 'https://s0.map.gtimg.com/customlayer/tile?z={z}&x={x}&y={y}&layerid=5fdc8d814247&version=3845',
  //   center: [39.856637, 116.681762]
  // }
]
