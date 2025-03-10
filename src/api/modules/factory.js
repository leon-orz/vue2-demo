import request from '@/common/request.js'

export default {
  // 查询总厂区设备 /factory_home/getFactoryHomePageCompanyMap
  getFactoryHomePageCompanyMap: (params) => {
    return request({
      url: '/api/factory_home/getFactoryHomePageCompanyMap',
      method: 'GET',
      params
    })
  },
  // 查询厂区设备 /factory_home/getFactoryHomePageMap
  getFactoryHomePageMap: (params) => {
    return request({
      url: '/api/factory_home/getFactoryHomePageMap',
      method: 'GET',
      params
    })
  },
  // /api/pathRegisterMain/getEquipmentThroughputNormalData
  getEquipmentThroughputNormalData: (params) => {
    return request({
      url: '/api/pathRegisterMain/getEquipmentThroughputNormalData',
      method: 'GET',
      params
    })
  },
  // /api/pathRegisterMain/getEquipmentThroughputNoNormalData
  getEquipmentThroughputNoNormalData: (params) => {
    return request({
      url: '/api/pathRegisterMain/getEquipmentThroughputNoNormalData',
      method: 'GET',
      params
    })
  },
  // /api/pathRegisterMain/getEquipmentThroughputStatusData
  getEquipmentThroughputStatusData: (params) => {
    return request({
      url: '/api/pathRegisterMain/getEquipmentThroughputStatusData',
      method: 'GET',
      params
    })
  },
  // /api/pathRegisterMain/getEquipmentThroughputStorageProportionData
  getEquipmentThroughputStorageProportionData: (params) => {
    return request({
      url: '/api/pathRegisterMain/getEquipmentThroughputStorageProportionData',
      method: 'GET',
      params
    })
  },
  // /api/pathRegisterMain/getEquipmentThroughputTimeStatusData
  getEquipmentThroughputTimeStatusData: (params) => {
    return request({
      url: '/api/pathRegisterMain/getEquipmentThroughputTimeStatusData',
      method: 'GET',
      params
    })
  },
  // /api/pathRegisterMain/getEquipmentThroughputStatusStatistics
  getEquipmentThroughputStatusStatistics: (params) => {
    return request({
      url: '/api/pathRegisterMain/getEquipmentThroughputStatusStatistics',
      method: 'GET',
      params
    })
  },
  // /api/pathRegisterMain/getEquipmentThroughputTaskData
  getEquipmentThroughputTaskData: (params) => {
    return request({
      url: '/api/pathRegisterMain/getEquipmentThroughputTaskData',
      method: 'GET',
      params
    })
  },
  // /api/pathRegisterMain/getEquipmentThroughputTaskStatistics
  getEquipmentThroughputTaskStatistics: (params) => {
    return request({
      url: '/api/pathRegisterMain/getEquipmentThroughputTaskStatistics',
      method: 'GET',
      params
    })
  },
  // /api/pathRegisterMain/getEquipmentThroughputInvestmentStatus
  getEquipmentThroughputInvestmentStatus: (params) => {
    return request({
      url: '/api/pathRegisterMain/getEquipmentThroughputInvestmentStatus',
      method: 'GET',
      params
    })
  },
  // pathRegisterMain/queryHandlingCapacityStatistics
  queryHandlingCapacityStatistics: (data) => {
    return request({
      url: '/api/pathRegisterMain/queryHandlingCapacityStatistics',
      method: 'POST',
      data
    })
  }
}
