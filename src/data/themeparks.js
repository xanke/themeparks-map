export const THEMEPARKS = [
  {
    label: 'Shanghai Disney Resort',
    value: 'shdr',
    tags: ['disneypand'],
    crs: 'baidu',
    layerUrl: '/shdr/media/maps/prod/shdr-baidu/{version}/{z}/{x}/{y}.jpg',
    versions: ['611231269', '740479929'],
    center: [31.1492, 121.6667],
    officialUrl: 'https://www.shanghaidisneyresort.com/en/'
  },
  {
    label: 'Hong Kong Disneyland Resort',
    value: 'hkdl',
    tags: ['disneypand'],
    layerUrl: 'https://cdn6.parksmedia.wdprapps.disney.com/media/maps/prod/hkdl/{version}/{z}/{x}/{y}.jpg',
    versions: [35],
    center: [22.3130715, 114.0410932],
    officialUrl: 'https://www.hongkongdisneyland.com/'
  },
  {
    label: 'California Disneyland Park',
    value: 'california',
    tags: ['disneypand'],
    layerUrl: '/california/media/maps/prod/disneyland/{version}/{z}/{x}/{y}.jpg',
    center: [33.811883, -117.91894],
    versions: [96, 538595539],
    officialUrl: 'https://disneyland.disney.go.com/'
  },
  {
    label: 'Paris Disneyland',
    value: 'paris',
    tags: ['disneypand'],
    layerUrl: 'https://media.disneylandparis.com/mapTiles/images/{z}/{x}/{y}.jpg',
    center: [48.8722379, 2.7736192],
    officialUrl: 'https://www.disneylandparis.com/'
  },
  {
    label: 'Orlando Disney World',
    value: 'orlando',
    tags: ['disneypand'],
    layerUrl: 'https://cdn6.parksmedia.wdprapps.disney.com/media/maps/prod/wdw/{version}/{z}/{x}/{y}.jpg',
    versions: [165, 677296982],
    center: [28.418862, -81.581254],
    officialUrl: 'https://disneyworld.disney.go.com/'
  },
  {
    label: 'Tokyo Disney Resort',
    value: 'tokyo',
    tags: ['disneypand'],
    layerUrl: '/tkydl/limited/map-image/{version}/daytime/z{z}/{x}_{y}.jpg',
    versions: ['20210210110000', '20250623170000'],
    center: [35.631777, 139.881632],
    officialUrl: 'https://www.tokyodisneyresort.jp/en/'
  },
  {
    label: 'Tokyo Disney Resort - Night',
    value: 'tokyoNight',
    tags: ['disneypand'],
    layerUrl: '/tkydl/limited/map-image/{version}/nighttime/z{z}/{x}_{y}.jpg',
    versions: ['20210210110000', '20250623170000'],
    center: [35.631777, 139.881632],
    officialUrl: 'https://www.tokyodisneyresort.jp/en/'
  },
  {
    label: 'Aulani Disney Resort',
    value: 'aulani',
    tags: ['disneypand'],
    layerUrl: 'https://cdn6.parksmedia.wdprapps.disney.com/media/maps/prod/aulani/{version}/{z}/{x}/{y}.jpg',
    versions: [1],
    center: [21.3358, -158.1186],
    officialUrl: 'https://www.disneyaulani.com/'
  },
  {
    label: 'Shanghai Lego Resort',
    value: 'shll',
    crs: 'tent',
    tags: ['legoland'],
    layerUrl: '/shll/lego//map/tiles/{z}/{x}_{y}.jpg',
    versions: [],
    center: [30.891576, 121.105336],
    officialUrl: 'https://www.legoland.com/shanghai/'
  },
  {
    label: 'USJ (Universal Studios Japan)',
    value: 'usj',
    tags: ['universal'],
    layerUrl: '/usj/assets/MapTiles/Production/{version}/512/{z}_{x}_{y}.jpg',
    versions: [30039],
    center: [34.665732, 135.432105],
    officialUrl: 'https://www.usj.co.jp/web/en/us'
  },
  {
    label: 'Universal Orlando Resort',
    value: 'usf',
    tags: ['universal'],
    layerUrl: 'https://services.universalorlando.com/assets/MapTiles/Production/{version}/512/{z}_{x}_{y}.jpg',
    versions: [10255],
    center: [28.478979, -81.468522],
    officialUrl: 'https://www.universalorlando.com/'
  },
  {
    label: 'Universal Studios Hollywood',
    value: 'ush',
    tags: ['universal'],
    layerUrl: 'https://services.universalorlando.com/assets/MapTiles/Production/{version}/512/{z}_{x}_{y}.jpg',
    versions: [10257],
    center: [34.1381, -118.3534],
    officialUrl: 'https://www.universalstudioshollywood.com/'
  },
  {
    label: 'Universal Beijing Resort',
    value: 'ubr',
    tags: ['universal'],
    layerUrl: 'https://services.universalorlando.com/assets/MapTiles/Production/{version}/512/{z}_{x}_{y}.jpg',
    versions: [10259],
    center: [39.8628, 116.6812],
    officialUrl: 'https://www.universalbeijingresort.com/'
  }
]

// 标签对应的中文分组名
export const TAG_NAMES = {
  disneypand: '迪士尼乐园',
  legoland: '乐高乐园',
  universal: '环球影城'
}

/**
 * 获取乐园指定版本的瓦片 URL
 * @param {Object} park 乐园数据
 * @param {string|number} [version] 目标版本，缺省时使用 versions 数组最后一项（当前版本）
 */
export const getLayerUrl = (park, version) => {
  const v = version ?? park.versions?.[park.versions.length - 1]
  return v !== undefined && v !== null && park.layerUrl.includes('{version}')
    ? park.layerUrl.replace('{version}', v)
    : park.layerUrl
}

/**
 * 根据 value 查找乐园
 */
export const getPark = (value) => THEMEPARKS.find((p) => p.value === value)
