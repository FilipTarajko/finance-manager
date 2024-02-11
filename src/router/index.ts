import { createRouter, createWebHistory } from 'vue-router'
import TransactionsView from '../views/TransactionsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'transactions',
      component: TransactionsView
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/CategoriesView.vue')
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('../views/StatisticsView.vue')
    },
    {
      path: '/export',
      name: 'export',
      component: () => import('../views/ExportView.vue')
    }
  ]
})

export default router
