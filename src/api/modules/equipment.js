import request from '@/common/request.js'

export default {
  // 查询总厂区设备
  MainFactoryAreaEquipment: (params) => {
    return request({
      url: '/api/factory_home/getFactoryHomePageCompanyList',
      method: 'GET',
      params
    })
  },
  // 查询厂区设备
  FactoryEquipment: (params) => {
    return request({
      url: '/api/factory_home/getFactoryHomePageList',
      method: 'GET',
      params
    })
  },
  // 查询工厂数据
  FactoryData: (params) => {
    return request({
      url: '/api/factory_home/getFactoryDataList',
      method: 'GET',
      params
    })
  },
  // 查询区域
  FactoryArea: (params) => {
    return request({
      url: '/api/sys_area/getSysAreaList',
      method: 'GET',
      params
    })
  },
  // 查询各类设备的吞吐量
  EquipmentThroughput: (params) => {
    return request({
      url: '/api/pathRegisterMain/getEquipmentThroughput',
      method: 'GET',
      params
    })
  },
  // 查询设备的吞吐量
  EquipmentThroughputDetail: (params) => {
    return request({
      url: '/api/pathRegisterMain/getEquipmentThroughputDetail',
      method: 'GET',
      params
    })
  },
  // 查询设备
  EquipmentList: (params) => {
    return request({
      url: '/api/equipment/getEquipmentList',
      method: 'GET',
      params
    })
  },
  // 查询单个设备的吞吐量
  EquipmentThroughputEquipmentDetail: (params) => {
    return request({
      url: '/api/pathRegisterMain/getEquipmentThroughputEquipmentDetail',
      method: 'GET',
      params
    })
  },
  // 查询设备图表
  EquipmentChart: (params) => {
    return request({
      url: '/api/pathRegisterMain/getEquiPathRegiMainHourSwaSpitNum',
      method: 'GET',
      params
    })
  },
  // 吞吐量日志 /pathRegisterMain/getPagePathRegisterMainList
  EquipmentThroughputLog: (params) => {
    return request({
      url: '/api/pathRegisterMain/getPagePathRegisterMainList',
      method: 'GET',
      params
    })
  },
  // /api/sys_equipment_service_detail/pageInfoSysEquipmentServiceDetail
  PageInfoSysEquipmentServiceDetail: (params) => {
    return request({
      url: '/api/sys_equipment_service_detail/pageInfoSysEquipmentServiceDetail',
      method: 'GET',
      params
    })
  },
  // 查询设备状态图表 /pathRegisterMain/getEquipmentStatusData
  EquipmentStatusChart: (params) => {
    return request({
      url: '/api/pathRegisterMain/getEquipmentStatusData',
      method: 'GET',
      params
    })
  },
  // /pathRegisterMain/getSysEquipmentServiceData
  GetSysEquipmentServiceData: (params) => {
    return request({
      url: '/api/pathRegisterMain/getSysEquipmentServiceData',
      method: 'GET',
      params
    })
  },
  // /pathRegisterMain/getEquipmentThroughputHeadAll
  GetEquipmentThroughputHeadAll: (params) => {
    return request({
      url: '/api/pathRegisterMain/getEquipmentThroughputHeadAll',
      method: 'GET',
      params
    })
  },
  // /pathRegisterMain/getEquipmentUtilizationRateData
  GetEquipmentUtilizationRateData: (params) => {
    return request({
      url: '/api/pathRegisterMain/getEquipmentUtilizationRateData',
      method: 'GET',
      params
    })
  },
  // /equipment/getEquipmentAreaHeadAll
  GetEquipmentAreaHeadAll: (params) => {
    return request({
      url: '/api/equipment/getEquipmentAreaHeadAll',
      method: 'GET',
      params
    })
  },
  // /equipment/getEquipmentAreaUtilizationRateData
  GetEquipmentAreaUtilizationRateData: (params) => {
    return request({
      url: '/api/equipment/getEquipmentAreaUtilizationRateData',
      method: 'GET',
      params
    })
  },
  // /equipment/getEquipmentAreaData
  GetEquipmentAreaData: (params) => {
    return request({
      url: '/api/equipment/getEquipmentAreaData',
      method: 'GET',
      params
    })
  },
  // /api/user/getUserList
  GetUserList: () => {
    return request({
      url: '/api/user/getUserList',
      method: 'GET'
    })
  },
  // 新增修改点检标准 /checkItem/insertOrUpdateCheckItem
  InsertOrUpdateCheckItem: (data) => {
    return request({
      url: '/api/checkItem/insertOrUpdateCheckItem',
      method: 'POST',
      data
    })
  },
  // 点检标准根据设备id查询 /checkItem/getCheckItem/{id}
  GetCheckItem: (params) => {
    return request({
      url: `/api/checkItem/getCheckItemByEquipmentCode`,
      method: 'POST',
      params
    })
  },
  // 设备点检项删除 /checkItem/del
  DelCheckItem: (params) => {
    return request({
      url: '/api/checkItem/del/',
      method: 'POST',
      params
    })
  },
  // 新增修改保养标准 /equipmentUpkeep/insertOrUpdateEquipmentUpkeep
  InsertOrUpdateEquipmentUpkeep: (data) => {
    return request({
      url: '/api/equipmentUpkeep/insertOrUpdateEquipmentUpkeep',
      method: 'POST',
      data
    })
  },
  // 保养标准根据设备id查询 /equipmentUpkeep/getEquipmentUpkeep/{id}
  GetEquipmentUpkeep: (params) => {
    return request({
      url: `/api/equipmentUpkeep/getEquipmentUpkeepByEquipmentCode`,
      method: 'POST',
      params
    })
  },
  //设备保养项删除 /equipmentUpkeep/del
  DelEquipmentUpkeep: (params) => {
    return request({
      url: '/api/equipmentUpkeep/del/',
      method: 'POST',
      params
    })
  },
  // 查询设备基本信息、点检项 /equipment/getEquipmentCheck
  GetEquipmentCheck: (data) => {
    return request({
      url: '/api/checkOrder/getPageCheckOrderList',
      method: 'POST',
      data
    })
  },
  // 点检记录表分页查询 /checkOrder/getPageCheckOrderList
  GetPageCheckOrderList: (params) => {
    return request({
      url: '/api/checkOrder/getPageCheckOrderList',
      method: 'GET',
      params
    })
  },
  // 点检记录详情 /checkOrder/getCheckOrderDetail
  GetCheckOrderDetail: (params) => {
    return request({
      url: '/api/checkOrder/getCheckOrderDetail',
      method: 'GET',
      params
    })
  },
  // 维修记录表分页查询 /equipmentMaintain/getPageEquipmentMaintainList
  GetPageEquipmentMaintainList: (params) => {
    return request({
      url: '/api/equipmentMaintain/getPageEquipmentMaintainList',
      method: 'GET',
      params
    })
  },
  // 保养工单分页查询 /equipment_upkeep_order/pageInfoEquipmentUpkeepOrder
  PageInfoEquipmentUpkeepOrder: (params) => {
    return request({
      url: '/api/equipment_upkeep_order/pageInfoEquipmentUpkeepOrder',
      method: 'GET',
      params
    })
  },
  // 保养工单查询详情 /equipment_upkeep_order/getEquipmentUpkeepOrderDetail
  GetEquipmentUpkeepOrderDetail: (params) => {
    return request({
      url: '/api/equipment_upkeep_order/getEquipmentUpkeepOrderDetail',
      method: 'GET',
      params
    })
  },
  // 新增和修改点检 /checkOrder/insertCheckOrder
  InsertCheckOrder: (params) => {
    return request({
      url: '/api/checkOrder/insertCheckOrder',
      method: 'POST',
      data: params
    })
  },
  // 新增保养项查询 /api/equipment/getEquipmentUpkeep
  GetEquipmentUpkeepz: (params) => {
    return request({
      url: '/api/equipment/getEquipmentUpkeep',
      method: 'GET',
      params
    })
  },
  // 保养工单新增 /equipment_upkeep_order/add
  AddEquipmentUpkeepOrder: (params) => {
    return request({
      url: '/api/equipment_upkeep_order/add',
      method: 'POST',
      data: params
    })
  },
  // 保养工单完成 /equipment_upkeep_order/complete
  CompleteEquipmentUpkeepOrder: (params) => {
    return request({
      url: '/api/equipment_upkeep_order/complete',
      method: 'POST',
      data: params
    })
  },
  // 查询设备类型集合 /api/checkItem/getEquipmentTypeList
  GetEquipmentTypeList: (params) => {
    return request({
      url: '/api/checkItem/getEquipmentTypeList',
      method: 'GET',
      data: params
    })
  },
  // 新增和修改维修记录标准 /equipmentMaintain/insertOrUpdateEquipmentMaintain
  InsertOrUpdateEquipmentMaintain: (params) => {
    return request({
      url: '/api/equipmentMaintain/insertOrUpdateEquipmentMaintain',
      method: 'POST',
      data: params
    })
  },
  // 设备维修删除 /equipmentMaintain/del
  DelEquipmentMaintain: (params) => {
    return request({
      url: '/api/equipmentMaintain/del',
      method: 'POST',
      params
    })
  },
  // 保养周期类型集合 /equipmentUpkeep/getMaintainCycleEnumsList
  GetMaintainCycleEnumsList: () => {
    return request({
      url: '/api/equipmentUpkeep/getMaintainCycleEnumsList',
      method: 'GET'
    })
  },
  // 保养方法类型集合 /equipmentUpkeep/getMaintainRespTypeList
  GetMaintainRespTypeList: () => {
    return request({
      url: '/api/equipmentUpkeep/getMaintainRespTypeList',
      method: 'GET'
    })
  },
  // /api/equipment_upkeep_order/getMaintainStatusList
  GetMaintainStatusList: () => {
    return request({
      url: '/api/equipment_upkeep_order/getMaintainStatusList',
      method: 'GET'
    })
  },
  // /api/dictionaries/getPrecisionDictionariesList GET 传值字段 function，值为 GZLX
  GetPrecisionDictionariesList: (params) => {
    return request({
      url: '/api/dictionaries/getPrecisionDictionariesList',
      method: 'GET',
      params
    })
  },
  // 设备变更审核分页查询 /equipment_change_review/pageInfoEquipmentChangeReview
  PageInfoEquipmentChangeReview: (params) => {
    return request({
      url: '/api/equipment_change_review/pageInfoEquipmentChangeReview',
      method: 'GET',
      params
    })
  },
  // 设备变更审核新增 /equipment_change_review/add
  AddEquipmentChangeReview: (params) => {
    return request({
      url: '/api/equipment_change_review/add',
      method: 'POST',
      data: params
    })
  },
  // 设备变更审核编辑 /equipment_change_review/edit
  EditEquipmentChangeReview: (params) => {
    return request({
      url: '/api/equipment_change_review/edit',
      method: 'POST',
      data: params
    })
  },
  // 设备变更审核删除 /equipment_change_review/del
  DelEquipmentChangeReview: (params) => {
    return request({
      url: '/api/equipment_change_review/del',
      method: 'POST',
      params
    })
  },
  // 设备变更审核批量提交 /equipment_change_review/batchSubmitEquipmentChangeReview
  BatchSubmitEquipmentChangeReview: (params) => {
    return request({
      url: '/api/equipment_change_review/batchSubmitEquipmentChangeReview',
      method: 'POST',
      params: params
    })
  },
  // 评估中确认 /equipment_change_review/confirmEvaluationEquipmentChangeReview
  ConfirmEvaluationEquipmentChangeReview: (params) => {
    return request({
      url: '/api/equipment_change_review/confirmEvaluationEquipmentChangeReview',
      method: 'POST',
      params: params
    })
  },
  // 评估中回退 /equipment_change_review/backEvaluationEquipmentChangeReview
  BackEvaluationEquipmentChangeReview: (params) => {
    return request({
      url: '/api/equipment_change_review/backEvaluationEquipmentChangeReview',
      method: 'POST',
      params: params
    })
  },
  // 审批通过 /equipment_change_review/approvedEquipmentChangeReview
  ApprovedEquipmentChangeReview: (params) => {
    return request({
      url: '/api/equipment_change_review/approvedEquipmentChangeReview',
      method: 'POST',
      params: params
    })
  },
  // 审批不通过 /equipment_change_review/noPassEquipmentChangeReview
  NoPassEquipmentChangeReview: (params) => {
    return request({
      url: '/api/equipment_change_review/noPassEquipmentChangeReview',
      method: 'POST',
      params: params
    })
  },
  // /api/dictionaries/getPrecisionDictionariesList data传参 function 字段传SBZT
  GetEquipmentStatusList: (params) => {
    return request({
      url: '/api/dictionaries/getPrecisionDictionariesList',
      method: 'GET',
      params: params
    })
  },
  // /api/equipment/getByCode/{code}
  GetByCode: (params) => {
    return request({
      url: '/api/equipment/getByCode/',
      method: 'GET',
      params
    })
  },
  // 设备变更审核编辑 /equipment_change_review/edit
  QueryPageListByEquipmentCode: (data) => {
    return request({
      url: '/api/equipmentState/queryPageListByEquipmentCode',
      method: 'POST',
      data: data
    })
  },
  // checkOrderDetail/queryListByOrderCodes
  CheckOrderDetailQueryListByOrderCodes: (params) => {
    return request({
      url: '/api/checkOrderDetail/queryListByOrderCodes',
      method: 'GET',
      params
    })
  },
  // checkOrderDetail/updateByIds
  CheckOrderDetailUpdateByIds: (data) => {
    return request({
      url: '/api/checkOrderDetail/updateByIds',
      method: 'PUT',
      data
    })
  },
  // checkOrder/updateStateByIds
  CheckOrderUpdateStateByIds: (params, data) => {
    return request({
      url: '/api/checkOrder/updateStateByIds',
      method: 'PUT',
      params,
      data
    })
  },
  // checkOrderDetail/updateUnFinishStateByIds
  CheckOrderDetailUpdateUnFinishStateByIds: () => {
    return request({
      url: '/api/checkOrderDetail/updateUnFinishStateByIds',
      method: 'PUT'
    })
  },
  // checkOrderDetail/getPageInfoByList
  CheckOrderDetailGetPageInfoByList: (data) => {
    return request({
      url: '/api/checkOrderDetail/getPageInfoByList',
      method: 'POST',
      data
    })
  },
  // equipmentUpkeepOrder/pageInfoEquipmentUpkeepOrder
  EquipmentUpkeepOrderPageInfoEquipmentUpkeepOrder: (data) => {
    return request({
      url: '/api/equipmentUpkeepOrder/pageInfoEquipmentUpkeepOrder',
      method: 'POST',
      data
    })
  },
  // equipmentUpkeepOrderDetail/queryListByOrderCodes
  EquipmentUpkeepOrderDetailQueryListByOrderCodes: (params) => {
    return request({
      url: '/api/equipmentUpkeepOrderDetail/queryListByOrderCodes',
      method: 'GET',
      params
    })
  },
  // equipmentUpkeepOrder/updateByIds
  EquipmentUpkeepOrderUpdateByIds: (params, data) => {
    return request({
      url: '/api/equipmentUpkeepOrder/updateByIds',
      method: 'PUT',
      params,
      data
    })
  },
  // equipmentUpkeepOrderDetail/updateFinishStateByIds
  EquipmentUpkeepOrderDetailUpdateFinishStateByIds: () => {
    return request({
      url: '/api/equipmentUpkeepOrderDetail/updateFinishStateByIds',
      method: 'PUT'
    })
  },
  // equipmentUpkeepOrderDetail/updateByIds
  EquipmentUpkeepOrderDetailUpdateByIds: (data) => {
    return request({
      url: '/api/equipmentUpkeepOrderDetail/updateByIds',
      method: 'PUT',
      data
    })
  },
  // /equipment/queryEquipmentStateBoardListByFactoryCode
  QueryEquipmentStateBoardListByFactoryCode: (params) => {
    return request({
      url: '/api/equipment/queryEquipmentStateBoardListByFactoryCode',
      method: 'GET',
      params
    })
  },
  // serverSurveillance/queryListByParam
  ServerSurveillanceQueryListByParam: (data) => {
    return request({
      url: '/api/serverSurveillance/queryListByParam',
      method: 'POST',
      data
    })
  },
  // /pathRegisterMain/querySonEquipmentList
  QuerySonEquipmentList: (params) => {
    return request({
      url: '/api/pathRegisterMain/querySonEquipmentList',
      method: 'GET',
      params
    })
  },

  // /sonEquipment/querySonEquipmentList查询设备列表
  SonEquipmentQuerySonEquipmentList: (params) => {
    return request({
      url: '/api/sonEquipment/querySonEquipmentList',
      method: 'GET',
      params
    })
  },

  // /sonEquipment/querySonEquipmentListByEquipmentCode 设备表根据编码查询对象
  QuerySonEquipmentListByEquipmentCode: (params) => {
    return request({
      url: '/api/sonEquipment/querySonEquipmentListByEquipmentCode',
      method: 'GET',
      params
    })
  },

  // /sonEquipment/querySonPagePathRegisterMainList 任务表分页查询
  QuerySonPagePathRegisterMainList: (params) => {
    return request({
      url: '/api/sonEquipment/querySonPagePathRegisterMainList',
      method: 'GET',
      params
    })
  },

  // /sonEquipment/querySonEquipmentThroughputStorageProportionData 查询仓储占比
  QuerySonEquipmentThroughputStorageProportionData: (params) => {
    return request({
      url: '/api/sonEquipment/querySonEquipmentThroughputStorageProportionData',
      method: 'GET',
      params
    })
  },

  // /sonEquipment/querySonEquipmentThroughputTimeStatusData 利用率饼图
  QuerySonEquipmentThroughputTimeStatusData: (params) => {
    return request({
      url: '/api/sonEquipment/querySonEquipmentThroughputTimeStatusData',
      method: 'GET',
      params
    })
  },
  // /sonEquipment/querySonEquipmentThroughputStatusStatistics 设备利用率柱状图
  QuerySonEquipmentThroughputStatusStatistics: (params) => {
    return request({
      url: '/api/sonEquipment/querySonEquipmentThroughputStatusStatistics',
      method: 'GET',
      params
    })
  },
  /**
   * 查询子设备吞吐量统计
   *
   * @param {Object} data - 请求数据，包含查询条件
   * @returns {Promise} - 返回请求结果的 Promise 对象
   */
  QuerySonHandlingCapacityStatistics: (data) => {
    return request({
      url: '/api/sonEquipment/querySonHandlingCapacityStatistics',
      method: 'POST',
      data
    })
  },
  // /sonEquipment/querySonEquipmentThroughputTaskData 查询运输任务量、仓储吞吐量
  QuerySonEquipmentThroughputTaskData: (params) => {
    return request({
      url: '/api/sonEquipment/querySonEquipmentThroughputTaskData',
      method: 'GET',
      params
    })
  }
}
