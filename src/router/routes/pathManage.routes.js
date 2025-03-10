export default {
  path: '/pathManagement',
  component: () => import('@/views/layout'),
  redirect: '/taskList',
  name: 'pathManagement',
  sort: 3,
  meta: { title: '系统部署', authCode: [''] },
  children: [
    {
      path: '/taskList',
      name: 'taskList',
      component: () => import('@/views/pathManage/taskList'),
      meta: {
        title: '任务列表',
        detail: false, //是否详情页
        authCode: ['']
      }
    },
    {
      path: '/taskListDetail',
      name: 'taskListDetail',
      hidden: true,
      component: () => import('@/views/pathManage/taskList/detail.vue'),
      meta: {
        title: '任务列表详情',
        detail: true, //是否详情页
        authCode: ['']
      }
    },
    {
      path: '/group',
      name: 'Group',
      component: () => import('@/views/pathManage/group'),
      meta: {
        title: '分组设置',
        detail: false, // 是否详情页
        authCode: ['']
      }
    },
    {
      path: '/theoreticalPath',
      name: 'TheoreticalPath',
      component: () => import('@/views/pathManage/theoreticalPath'),
      meta: {
        title: '物流路线',
        detail: false, // 是否详情页
        authCode: ['']
      }
    },
    {
      path: '/pathSetting',
      name: 'pathSetting',
      hidden: true,
      component: () => import('@/views/pathManage/pathSetting'),
      meta: {
        title: '路径设置',
        detail: true, //是否详情页
        authCode: ['']
      }
    },
    {
      path: '/pathSettingDetail',
      name: 'pathSettingDetail',
      hidden: true,
      component: () => import('@/views/pathManage/pathSetting/detail.vue'),
      meta: {
        title: '路径设置详情',
        detail: true, //是否详情页
        authCode: ['']
      }
    },
    {
      path: '/taskRouteStatistics',
      name: 'TaskRouteStatistics',
      component: () => import('@/views/pathManage/taskRouteStatistics/index.vue'),
      meta: {
        title: '任务路线统计',
        detail: false, // 是否详情页
        authCode: ['']
      }
    }
  ]
}
