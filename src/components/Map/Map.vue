<style>

</style>

<template>
  <div class="ds-map">
    <v-map v-if="crs === 'baidu'" :crs="crsBaidu" ref="map" :zoom="18" :min-zoom="10" :max-zoom="20" :center="center" :options="options">
      <marker-cluster :options="clusterOptions">
        <slot></slot>
      </marker-cluster>
    </v-map>
    <v-map v-else-if="crs === 'tent'" :crs="crsTent" ref="map" :zoom="18" :min-zoom="10" :max-zoom="20" :center="center" :options="options">
      <marker-cluster :options="clusterOptions">
        <slot></slot>
      </marker-cluster>
    </v-map>
    <v-map v-else ref="map" :zoom="18" :min-zoom="14" :max-zoom="20" :center="center" :options="options">
      <marker-cluster :options="clusterOptions">
        <slot></slot>
      </marker-cluster>
    </v-map>
  </div>
</template>

<script>
/* eslint-disable */
import crsBaidu from './lib/crs.baidu'
import webdogTileLayer from './lib/webdogTileLayer'
import MarkerCluster from './MarkerCluster'
import L from 'leaflet';
const NAME = 'att-map'

export default {
  name: NAME,

  components: {
    MarkerCluster
  },

  props: {
    local: String,
    center: Array,
    crs: String,
    layerUrl: String
  },

  watch: {
    layerUrl() {
      this.init()
    }
  },

  data() {
    return {
      options: {
        zoomSnap: 0.05, // 设置无极缩放
        touchZoom: 'center', // 双指缩放地图的同时锁定地图移动
        bounceAtZoomLimits: false // 关闭回弹
      },
      crsBaidu,
      crsTent: L.CRS.EPSG3857,
      popupOption: {
        autoClose: false,
        closeButton: false,
        minWidth: 300,
        className: 'att-popup'
      },
      tilelayerOptions: {
        tms: true
      },
      clusterOptions: {
        animate: false,
        maxClusterRadius: 45, // 合并半径
        showCoverageOnHover: false,
        // disableClusteringAtZoom: 20
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
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      const map = this.$refs.map.mapObject
      const options = {
        maxZoom: 20
      }

      if (this.crs === 'baidu') {
        options.getUrlArgs = (tilePoint) => {
          return {
            z: tilePoint.z,
            x: tilePoint.x + Math.pow(2, tilePoint.z - 1),
            y: tilePoint.y + Math.pow(2, tilePoint.z - 1)
          }
        }

        // options.getUrlArgs = (tilePoint) => {
        //   console.log(tilePoint);
        //   return {
        //     z: tilePoint.z,
        //     x: tilePoint.x,
        //     y: Math.pow(2, tilePoint.z) - 1 - tilePoint.y
        //   }
        // }
      }

      webdogTileLayer(this.layerUrl, options).addTo(map)
    }
  }
}
</script>

