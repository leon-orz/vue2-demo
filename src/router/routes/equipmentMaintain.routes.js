export default {
  path: '/equipmentMaintain',
  component: () => import('@/views/layout'),
  redirect: '/equipmentCheck',
  name: 'equipmentMaintain',
  sort: 2,
  meta: { title: '设备运维', authCode: [''] },
  children: [
    {
      path: '/equipmentCheck',
      name: 'EquipmentCheck',
      component: () => import('@/views/deviceManage/equipmentCheck/index.vue'),
      meta: {
        title: '设备点检',
        detail: false, // 是否详情页
        authCode: ['']
      }
    },
    {
      path: '/equipmentCheckDetails',
      name: 'EquipmentCheckDetails',
      hidden: true,
      component: () => import('@/views/deviceManage/equipmentCheck/details.vue'),
      meta: {
        title: '设备点检详情',
        detail: true, // 是否详情页
        authCode: ['']
      }
    },
    {
      path: '/equipmentCheckRecord',
      name: 'EquipmentCheckRecord',
      component: () => import('@/views/deviceManage/spotCheckRecord/index.vue'),
      meta: {
        title: '设备点检记录',
        detail: false, // 是否详情页
        authCode: ['']
      }
    },
    {
      path: '/equipmentMaintenance',
      name: 'EquipmentMaintenance',
      component: () => import('@/views/deviceManage/equipmentMaintenance/index.vue'),
      meta: {
        title: '设备保养',
        detail: false, // 是否详情页
        authCode: ['']
      }
    },
    {
      path: '/equipmentMaintenanceDetails',
      name: 'EquipmentMaintenanceDetails',
      hidden: true,
      component: () => import('@/views/deviceManage/equipmentMaintenance/details.vue'),
      meta: {
        title: '设备保养详情',
        detail: true, // 是否详情页
        authCode: ['']
      }
    },
    {
      path: '/equipmentMaintenanceRecord',
      name: 'EquipmentMaintenanceRecord',
      component: () => import('@/views/deviceManage/equipmentMaintenance/record.vue'),
      meta: {
        title: '设备保养记录',
        detail: false, // 是否详情页
        authCode: ['']
      }
    },
    {
      path: '/equipmentRepairRecord',
      name: 'EquipmentRepairRecord',
      component: () => import('@/views/deviceManage/equipmentRepair/record.vue'),
      meta: {
        title: '设备维修记录',
        detail: false, // 是否详情页
        authCode: ['']
      }
    },
    {
      path: '/overviewOfStatus',
      name: 'OverviewOfStatus',
      component: () => import('@/views/deviceManage/overviewOfStatus/index.vue'),
      meta: {
        title: '状态总览',
        detail: false, // 是否详情页
        authCode: ['']
      }
    }
  ]
}
