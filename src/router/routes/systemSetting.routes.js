export default {
  path: '/systemSetting',
  component: () => import('@/views/layout'),
  redirect: '/systemSettingz',
  name: 'SystemSetting',
  sort: 1,
  meta: { title: '系统设置', authCode: [''] },
  children: [
    // {
    //   path: '/systemSettingz',
    //   name: 'SystemSettingz',
    //   component: () => import('@/views/home/blank'),
    //   meta: {
    //     title: '系统设置',
    //     detail: false, //是否详情页
    //     authCode: ['']
    //   }
    // },
    {
      path: '/regional',
      name: 'Regional',
      component: () => import('@/views/deviceManage/regional'),
      meta: {
        title: '区域设置',
        detail: false, // 是否详情页
        authCode: ['']
      }
    },
    {
      path: '/pointSetting',
      name: 'pointSetting',
      component: () => import('@/views/pathManage/pointsetting'),
      meta: {
        title: '点位设置',
        detail: false, //是否详情页
        authCode: ['']
      }
    },
    {
      path: '/dictMaintain',
      name: 'dictMaintain',
      component: () => import('@/views/systemSetting/dictMaintain'),
      meta: {
        title: '字典维护',
        detail: false, //是否详情页
        authCode: ['']
      }
    }
  ]
}
