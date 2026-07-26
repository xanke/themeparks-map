import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import ParkMap from '@/views/ParkMap.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/park/:id',
    name: 'ParkMap',
    component: ParkMap,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
