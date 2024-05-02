import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'transactions',
      alias: '/transactions',
      component: () => import('../views/TransactionsView.vue')
    },
    {
      path: '/transactions/:transactionId',
      name: 'transaction',
      component: () => import('../views/TransactionDetailsView.vue')
    },
    {
      path: '/categories',
      children: [
        {
          path: '',
          name: 'categories',
          component: () => import('../views/CategoriesView.vue')
        },
        {
          path: ':categoryId',
          name: 'category',
          component: () => import('../views/CategoryDetailsView.vue')
        }
      ]
    },
    {
      path: '/accounts',
      children: [
        {
          path: '',
          name: 'accounts',
          component: () => import('../views/AccountsView.vue')
        },
        {
          path: ':accountId',
          name: 'account',
          component: () => import('../views/AccountDetailsView.vue')
        }
      ]
    },
    {
      path: '/currencies',
      children: [
        {
          path: '',
          name: 'currencies',
          component: () => import('../views/CurrenciesView.vue')
        },
        {
          path: ':currencyId',
          name: 'currency',
          component: () => import('../views/CurrencyDetailsView.vue')
        }
      ]
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
