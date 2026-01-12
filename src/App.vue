<template>
  <div id="app">
    <a-radio-group v-model="active" @change="onChange">
      <a-radio-button :value="item.value" v-for="(item, index) in THEMEPARKS" :key="index">
        {{item.label}}
      </a-radio-button>
    </a-radio-group>
    <Map v-if="active" style="width: 100%; height: 100vh" :crs="options.crs" :layerUrl="options.layerUrl" :center="options.center"></Map>
  </div>
</template>

<script>
import Map from '@/components/Map/Map'
import {THEMEPARKS} from '@/data/themeparks'

export default {
  name: 'App',
  components: {
    Map
  },
  data() {
    return {
      active: '',
      THEMEPARKS,
      options: {}
    }
  },

  created() {
    this.showMap('shdr')
  },

  methods: {
    onChange(e) {
      this.showMap(e.target.value)
    },

    showMap(value) {
      this.options = THEMEPARKS.find(_ => _.value === value)
    }
  }
}
</script>

<style>
/* 针对所有瓦片层 */ .leaflet-tile-container { pointer-events: none; } .leaflet-tile { /* 核心代码：防止浏览器进行亚像素渲染导致的间隙 */ outline: 1px solid transparent; /* 某些情况下，将硬件加速偏移改为整数像素 */ -webkit-backface-visibility: hidden; }
</style>