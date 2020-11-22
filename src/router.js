import { createWebHistory, createRouter } from 'vue-router'
import Player from '@/views/Player.view'
import Search from '@/views/Search.view'

const routes = [
  {
    path: '/',
    name: 'Player',
    component: Player,
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router