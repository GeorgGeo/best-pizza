import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import CartView from '@/views/CartView.vue'
import ProfileView from '@/views/ProfileView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    props: true,
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartView,
    props: true,
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    props: true,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router