<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
</script>

<style>
/* 针对所有瓦片层 */
.leaflet-tile-container { pointer-events: none; }
.leaflet-tile {
  /* 核心代码：防止浏览器进行亚像素渲染导致的间隙 */
  outline: 1px solid transparent;
  /* 某些情况下，将硬件加速偏移改为整数像素 */
  -webkit-backface-visibility: hidden;
}
</style>
