<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
</script>

<style>
/* 瓦片层不拦截鼠标事件 */
.leaflet-tile-container { pointer-events: none; }

/* 修复瓦片缝隙：透明 outline 扩展绘制边界 + 禁用反锯齿 + GPU 独立合成 */
.leaflet-tile {
  outline: 1px solid transparent;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}

/* fractional zoom 时提示浏览器对瓦片容器做高质量缩放 */
.leaflet-zoom-anim .leaflet-zoom-animated {
  will-change: transform;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}
</style>
