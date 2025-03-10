export default {
  path: '/home',
  component: () => import('@/views/layout'),
  redirect: '/home',
  name: 'home',
  sort: 5,
  meta: { title: '运营绩效', authCode: [''] },
  children: [
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/home/home.vue'),
      meta: {
        title: '工厂总览',
        detail: false, //是否详情页
        authCode: ['']
      }
    },
    {
      path: '/home-area',
      name: 'HomeArea',
      hidden: true,
      component: () => import('@/views/home/home-area.vue'),
      meta: {
        title: '区域',
        detail: true, //是否详情页
        authCode: ['']
      }
    },
    {
      path: '/home-device-type',
      name: 'HomeDeviceType',
      hidden: true,
      component: () => import('@/views/home/home-device-type.vue'),
      meta: {
        title: '设备类型',
        detail: true, //是否详情页
        authCode: ['']
      }
    },
    {
      path: '/home-device',
      name: 'HomeDevice',
      hidden: true,
      component: () => import('@/views/home/home-device.vue'),
      meta: {
        title: '设备',
        detail: true, //是否详情页
        authCode: ['']
      }
    },
    {
      path: '/home-device-sub',
      name: 'HomeDeviceSub',
      hidden: true,
      component: () => import('@/views/home/home-device-sub.vue'),
      meta: {
        title: '设备',
        detail: true, //是否详情页
        authCode: ['']
      }
    },
    {
      path: '/regionalStatistics',
      name: 'RegionalStatistics',
      component: () => import('@/views/deviceManage/regionalStatistics'),
      meta: {
        title: '区域统计',
        detail: false, // 是否详情页
        authCode: ['']
      }
    },
    {
      path: '/data-dashboard',
      name: 'DataDashboard',
      component: () => import('@/views/home/data-dashboard'),
      meta: {
        title: '数据看板',
        detail: false, // 是否详情页
        authCode: ['']
      }
    }
    // {
    //   path: '/equipmentAnalysisReport',
    //   name: 'EquipmentAnalysisReport',
    //   component: () => import('@/views/home/blank'),
    //   meta: {
    //     title: '设备分析报表',
    //     detail: false, // 是否详情页
    //     authCode: ['']
    //   }
    // }
  ]
}
