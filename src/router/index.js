import { createRouter, createWebHistory } from 'vue-router'

import Main from '../views/main.vue'
import ProductListView from '../views/ProductListView.vue'
import BoardView from '../views/BoardView.vue'
import AccountBookView from '../views/AccountBookView.vue'

const routes = [
  { path: '/', component: Main },

  // 기존 상품 게시판
  { path: '/products/list', component: ProductListView },

  // 일반 게시판
  { path: '/boards/:boardIdx', component: BoardView },

  // 가계부 게시판
  { path: '/boards/:boardIdx/account-books', component: AccountBookView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
