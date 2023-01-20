import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/form', component: () => import('pages/FormPage.vue') },
      {
        path: '/tradingview',
        component: () => import('pages/TradingViewPage.vue')
      },
      {
        path: '/meterdata',
        component: () => import('pages/MeterDataPage.vue')
      },
      {
        path: '/orderbook',
        component: () => import('pages/OrderBookPage.vue')
      },
      {
        path: '/orderbook',
        component: () => import('pages/OrderBookPage.vue')
      },
      {
        path: '/candlestick',
        component: () => import('pages/CandlestickPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;
