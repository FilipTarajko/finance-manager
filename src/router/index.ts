import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'categories',
      component: () => import('../views/CategoriesView.vue')
    },
    {
      path: '/categories/:categoryId',
      name: 'category',
      component: () => import('../views/CategoryDetailsView.vue')
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: () => import('../views/AccountsView.vue')
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('../views/TransactionsView.vue')
    },
    {
      path: '/transactions/:transactionId',
      name: 'transaction',
      component: () => import('../views/TransactionDetailsView.vue')
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('../views/StatisticsView.vue')
    },
    {
      path: '/importexport',
      name: 'importexport',
      component: () => import('../views/ImportExportView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      redirect: '/'
    }
  ]
})

export default router
