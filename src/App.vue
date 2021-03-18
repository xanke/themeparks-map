<template>
  <div id="app">
    <a-radio-group v-model="active" @change="onChange">
      <a-radio-button :value="item.value" v-for="(item, index) in THEMEPARKS" :key="index">
        {{item.label}}
      </a-radio-button>
    </a-radio-group>
    <Map v-if="active" style="width: 100%; height: 800px" :crs="options.crs" :layerUrl="options.layerUrl" :center="options.center"></Map>
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
    
  },

  methods: {
    onChange(e) {
      this.options = THEMEPARKS.find(_ => _.value === e.target.value)
    }
  }
}
</script>
