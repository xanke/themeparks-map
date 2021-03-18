<template>
  <div id="app">
    <Map style="width: 100%; height: 800px" local="shanghai" :center="[31.1492, 121.6667]"></Map>
  </div>
</template>

<script>
import Map from '@/components/Map/Map'

export default {
  name: 'App',
  components: {
    Map
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
