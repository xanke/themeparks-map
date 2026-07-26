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

// 暴露 clusterGroup 供外部使用
defineExpose({
  clusterGroup,
  mapInstance
})
</script>

<style>
.ds-map {
  height: 100vh;
}
</style>
