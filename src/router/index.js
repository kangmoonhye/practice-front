import { createRouter, createWebHistory } from 'vue-router'
import Main from '../views/main.vue'
import ProductListView from '../views/ProductListView.vue'

const routes = [
  { path: '/', component: Main },
  { path: '/product/list', component: ProductListView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
