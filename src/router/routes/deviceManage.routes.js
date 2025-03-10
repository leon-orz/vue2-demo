export default {
  path: '/deviceManage',
  component: () => import('@/views/layout'),
  redirect: '/deviceAccountBook',
  name: 'deviceManage',
  sort: 4,
  meta: { title: '设备管理', authCode: [''] },
  children: [
    {
      path: '/deviceAccountBook',
      name: 'deviceAccountBook',
      component: () => import('@/views/deviceManage/deviceAccount'),
      meta: {
        title: '设备台账',
        detail: false, //是否详情页
        authCode: ['']
      }
    },
    {
      path: '/deviceAccountDetail',
      name: 'deviceAccountDetail',
      hidden: true,
      component: () => import('@/views/deviceManage/deviceAccount/detail.vue'),
      meta: {
        title: '设备台账详情',
        detail: true, //是否详情页
        authCode: ['']
      }
    },
    {
      path: '/deviceManagement',
      name: 'DeviceManagement',
      component: () => import('@/views/softwareManage/deviceManagement'),
      meta: {
        title: '设备管理',
        detail: false, //是否详情页
        authCode: ['']
      }
    },
    {
      path: '/deviceManagementDetail',
      name: 'DeviceManagementDetail',
      hidden: true,
      component: () => import('@/views/softwareManage/deviceManagementDetail'),
      meta: {
        title: '设备管理',
        detail: true, //是否详情页
        authCode: ['']
      }
    },
    {
      path: '/serviceManagement',
      name: 'ServiceManagement',
      component: () => import('@/views/softwareManage/serviceManagement'),
      meta: {
        title: '服务管理',
        detail: false, //是否详情页
        authCode: ['']
      }
    },
    {
      path: '/serviceManagementDetail',
      name: 'ServiceManagementDetail',
      hidden: true,
      component: () => import('@/views/softwareManage/serviceManagementDetail'),
      meta: {
        title: '服务管理',
        detail: true, //是否详情页
        authCode: ['']
      }
    },
    {
      path: '/equipmentChangeReview',
      name: 'EquipmentChangeReview',
      component: () => import('@/views/softwareManage/equipmentChangeReview/index'),
      meta: {
        title: '设备变更审核',
        detail: false, //是否详情页
        authCode: ['']
      }
    }
  ]
}
