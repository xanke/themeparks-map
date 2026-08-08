<template>
  <div class="ds-map">
    <LMap
      v-if="crs === 'baidu'"
      ref="mapRef"
      :crs="crsBaidu"
      :zoom="18"
      :min-zoom="10"
      :max-zoom="20"
      :center="center"
      :options="mapOptions"
      @ready="onMapReady"
    />
    <LMap
      v-else-if="crs === 'tent'"
      ref="mapRef"
      :crs="crsTent"
      :zoom="18"
      :min-zoom="10"
      :max-zoom="20"
      :center="center"
      :options="mapOptions"
      @ready="onMapReady"
    />
    <LMap
      v-else
      ref="mapRef"
      :zoom="18"
      :min-zoom="14"
      :max-zoom="20"
      :center="center"
      :options="mapOptions"
      @ready="onMapReady"
    />
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, watch } from 'vue'
import { LMap } from '@vue-leaflet/vue-leaflet'
import crsBaidu from './lib/crs.baidu'
import webdogTileLayer from './lib/webdogTileLayer'
import L from 'leaflet'
import 'leaflet.markercluster'

const props = defineProps({
  local: String,
  center: Array,
  crs: String,
  layerUrl: String
})

const mapRef = ref(null)

const mapOptions = ref({
  zoomSnap: 0.05,
  touchZoom: 'center',
  bounceAtZoomLimits: false
})

const crsTent = L.CRS.EPSG3857

const clusterOptions = {
  animate: false,
  maxClusterRadius: 45,
  showCoverageOnHover: false,
  iconCreateFunction(cluster) {
    return L.divIcon({
      className: 'att-marker att-marker--more',
      html: `
        <div class="att-marker__child-1"></div>
        <div class="att-marker__child-2"></div>
        <div class="att-marker__content">
          <div class="att-marker__num">${cluster.getChildCount()}</div>
        </div>
        <div class="att-marker__tip__container">
          <div class="att-marker__tip">
        </div>
      `
    })
  }
}

let mapInstance = null
let clusterGroup = null
let tileLayer = null

const onMapReady = (map) => {
  mapInstance = map

  // 初始化 MarkerCluster
  clusterGroup = L.markerClusterGroup(clusterOptions)
  mapInstance.addLayer(clusterGroup)

  initTileLayer()
}

const initTileLayer = () => {
  if (!mapInstance) return

  // 先移除旧的瓦片层，避免版本切换时图层叠加
  if (tileLayer) {
    mapInstance.removeLayer(tileLayer)
    tileLayer = null
  }

  const options = {
    maxZoom: 20
  }

  if (props.crs === 'baidu') {
    options.getUrlArgs = (tilePoint) => {
      return {
        z: tilePoint.z,
        x: tilePoint.x + Math.pow(2, tilePoint.z - 1),
        y: tilePoint.y + Math.pow(2, tilePoint.z - 1)
      }
    }
  }

  tileLayer = webdogTileLayer(props.layerUrl, options)
  tileLayer.addTo(mapInstance)
}

watch(
  () => props.layerUrl,
  () => {
    initTileLayer()
  }
)

// 等待瓦片加载完成（最长等待 3 秒），避免下载到空白区域
const waitForTilesLoaded = () => {
  return new Promise((resolve) => {
    if (!tileLayer || typeof tileLayer.isLoading !== 'function' || !tileLayer.isLoading()) {
      resolve()
      return
    }
    const timer = setTimeout(resolve, 3000)
    tileLayer.on('load', () => {
      clearTimeout(timer)
      resolve()
    })
  })
}

// 判断瓦片是否为同源资源（同源瓦片可直接绘制，不会污染 canvas）
const isSameOrigin = (url) => {
  try {
    return new URL(url, location.href).origin === location.origin
  } catch (e) {
    return false
  }
}

// 以 CORS 方式重新加载瓦片，确保绘制后 canvas 不被污染（仅用于跨域瓦片）
const loadCleanImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('瓦片跨域加载失败'))
    img.src = src
  })

// 将当前地图视图绘制到 canvas
const captureMapCanvas = async () => {
  if (!mapInstance) throw new Error('地图尚未就绪')
  await waitForTilesLoaded()

  const container = mapInstance.getContainer()
  const mapRect = container.getBoundingClientRect()
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(mapRect.width)
  canvas.height = Math.round(mapRect.height)
  const ctx = canvas.getContext('2d')

  // 背景填充，避免未加载瓦片区域透明
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 通过 getBoundingClientRect 计算瓦片屏幕位置，
  // 自动兼容 fractional zoom 下瓦片容器的缩放变换
  const tileEls = Array.from(container.querySelectorAll('img.leaflet-tile-loaded'))
  const drawItems = []
  let corsFailed = false

  await Promise.all(
    tileEls.map(async (el) => {
      const rect = el.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return
      if (isSameOrigin(el.src)) {
        // 同源瓦片（如走代理的 shdr/tokyo）直接绘制，无额外请求
        drawItems.push({ img: el, rect })
      } else {
        // 跨域瓦片需以 CORS 重新加载，避免污染 canvas 导致无法导出
        try {
          const cleanImg = await loadCleanImage(el.src)
          drawItems.push({ img: cleanImg, rect })
        } catch (e) {
          corsFailed = true
        }
      }
    })
  )

  if (corsFailed) {
    throw new Error('该地图源不支持跨域导出')
  }

  drawItems.forEach(({ img, rect }) => {
    ctx.drawImage(
      img,
      rect.left - mapRect.left,
      rect.top - mapRect.top,
      rect.width,
      rect.height
    )
  })

  return canvas
}

// 一键下载当前地图视图为 PNG
const downloadMapAsImage = async (filename = 'map.png') => {
  const canvas = await captureMapCanvas()
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('导出图片失败'))
          return
        }
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        resolve()
      }, 'image/png')
    } catch (e) {
      reject(e)
    }
  })
}

// 暴露给父组件：getMapInstance/getClusterGroup 以函数形式暴露，
// 保证调用时取到的是初始化后的最新实例
defineExpose({
  getMapInstance: () => mapInstance,
  getClusterGroup: () => clusterGroup,
  downloadMapAsImage
})
</script>

<style>
.ds-map {
  height: 100vh;
}
</style>
