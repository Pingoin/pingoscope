import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/position',
    name: 'Position',
    component: () => import('../views/Position.vue')
  },
  {
    path: '/sensors',
    name: 'Sensors',
    component: () => import('../views/Sensors.vue')
  },
  {
    path: '/control',
    name: 'Control',
    component: () => import('../views/Control.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
