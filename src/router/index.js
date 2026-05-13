import { createRouter, createWebHistory } from 'vue-router'

import Main from '../views/main.vue'
import ProductListView from '../views/ProductListView.vue'
import BoardView from '../views/BoardView.vue'
import AccountBookView from '../views/AccountBookView.vue'

const routes = [
  { path: '/', component: Main },

  { path: '/products/list', component: ProductListView },

  { path: '/boards/:boardIdx/products', component: ProductListView },

  { path: '/boards/:boardIdx/account', component: AccountBookView },

  { path: '/boards/:boardIdx', component: BoardView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
