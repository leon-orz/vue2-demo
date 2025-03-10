import request from '@/common/request.js'

export default {
  // 分组分页查询 /sys_group/pageInfoSysGroup
  RegionalPagingQuery: (params) => {
    return request({
      url: '/api/sys_area/pageInfoSysArea',
      method: 'GET',
      params
    })
  },
  // 分组操作 新增 /sys_group/add
  RegionalOperate: (data, type) => {
    return request({
      url: `/api/sys_area/${type}`,
      method: 'POST',
      data
    })
  },
  RegionalDel: (params) => {
    return request({
      url: `/api/sys_area/del`,
      method: 'POST',
      params
    })
  },
  // 查询区域统计设备
  QueryRegionalStatistical: (params) => {
    return request({
      url: `/api/equipment/getEquipmentAreaData`,
      method: 'GET',
      params
    })
  }
}
