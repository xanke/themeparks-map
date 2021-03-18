import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
import initLeaflet from '@/core/leaflet'

initLeaflet(Vue)

new Vue({
  render: h => h(App),
}).$mount('#app')
