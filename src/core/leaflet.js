import * as Vue2Leaflet from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'
export default function init(Vue) {
  Vue.component('v-map', Vue2Leaflet.LMap)
  Vue.component('v-tilelayer', Vue2Leaflet.LTileLayer)
  Vue.component('v-marker', Vue2Leaflet.LMarker )
  Vue.component('v-popup', Vue2Leaflet.LPopup)
  Vue.component('v-tooltip', Vue2Leaflet.LTooltip )
}

