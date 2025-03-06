const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
  },
  // 运营绩效 Operational performance
  {
    path: '/',
    name: 'Home',
    component: () => import('@/layout/index.vue'),
    redirect: '/factory-overview',
    meta: { title: '运营绩效' },
    children: [
      // 工厂总览 factory-overview
      {
        path: '/factory-overview',
        name: 'FactoryOverview',
        component: () => import('@/views/factory-overview/index.vue'),
        meta: {
          title: '工厂总览',
          secondary: false,
        },
      },
    ],
  },
  // 设备管理 Equipment management
  {
    path: '/equipment-management',
    name: 'EquipmentManagement',
    component: () => import('@/layout/index.vue'),
    redirect: '/equipment-ledger',
    meta: { title: '设备管理' },
    children: [
      // 设备台账 Equipment ledger
      {
        path: '/equipment-ledger',
        name: 'EquipmentLedger',
        component: () => import('@/views/equipment-ledger/index.vue'),
        meta: {
          title: '设备台账',
          secondary: false,
        },
      },
    ],
  },
]

export default routes
