import request from "@/common/request.js";

export default {
  //获取字典表
  getPrecisionData: (params) => {
    return request({
      url: "/api/dictionaries/getPrecisionDictionariesList",
      method: "GET",
      alertSuccess: true,
      params,
    });
  },
  //查询首页设备数据
  getDeviceTotalData: () => {
    return request({
      url: "/api/pathRegisterMain/getEquipmentThroughput",
      method: "GET",
      alertSuccess: true,
    });
  },
  //查询首页详情设备数据
  getHomeDeviceDetailData: (params) => {
    return request({
      url: "/api/pathRegisterMain/getEquipmentThroughputDetail/" + params,
      method: "GET",
      alertSuccess: true,
    });
  },
  //查询主设备列表
  queryDeviceAccountTable: (params) => {
    return request({
      url: "/api/equipment/getPageEquipmentList",
      method: "GET",
      alertSuccess: true,
      params,
    });
  },
  //查询主设备列表
  queryEquipmentList: (params) => {
    return request({
      url: "/api/equipment/getEquipmentList",
      method: "GET",
      alertSuccess: true,
      params,
    });
  },
  //删除主设备
  deleteMainDeviceData: (data) => {
    return request({
      url: "/api/equipment/deleteEquipmentList",
      method: "POST",
      alertSuccess: true,
      data,
    });
  },
  //新增主设备
  addMainDeviceData: (data) => {
    return request({
      url: "/api/equipment/insertEquipmentList",
      method: "POST",
      alertSuccess: true,
      data,
    });
  },
  //修改主设备
  updateMainDeviceData: (data) => {
    return request({
      url: "/api/equipment/updateEquipmentList",
      method: "POST",
      alertSuccess: true,
      data,
    });
  },
  //查询未绑定的主设备下子设备信息
  queryEquipmentNotData: (params) => {
    return request({
      url: "/api/equipmentHierarchy/getEquipmentNotList",
      method: "GET",
      alertSuccess: true,
      params,
    });
  },
  //查询主设备详情信息
  getDeviceDetailData: (params) => {
    return request({
      url: "/api/equipment/" + params,
      method: "GET",
      alertSuccess: true,
    });
  },
  //查询主设备下子设备数据
  getDeviceSubsetDetailData: (params) => {
    return request({
      url: "/api/equipmentHierarchy/getEquipmentAndSunEqu",
      method: "GET",
      alertSuccess: true,
      params,
    });
  },
  //删除已绑定的子设备
  deleteSubDeviceData: (data) => {
    return request({
      url: "/api/equipmentHierarchy/deleteEquipmentHierarchyList",
      method: "POST",
      alertSuccess: true,
      data,
    });
  },
  //新增主设备下已绑定的子设备信息
  addSubDeviceData: (data) => {
    return request({
      url: "/api/equipmentHierarchy/insertEquipmentList",
      method: "POST",
      alertSuccess: true,
      data,
    });
  },
  //查询点位列表
  queryPoinTable: (params) => {
    return request({
      url: "/api/point/getPagePointList",
      method: "GET",
      alertSuccess: true,
      params,
    });
  },
  //新增点位列表
  addPoinData: (data) => {
    return request({
      url: "/api/point/insertPointList",
      method: "POST",
      alertSuccess: true,
      data,
    });
  },
  //修改点位列表
  updatePoinData: (data) => {
    return request({
      url: "/api/point/updatePointList",
      method: "POST",
      alertSuccess: true,
      data,
    });
  },
  //删除点位列表
  deletePoineData: (data) => {
    return request({
      url: "/api/point/deletePointList",
      method: "POST",
      alertSuccess: true,
      data,
    });
  },
  //清除绑定路径的点位
  batchUpdatePoint: (params) => {
    return request({
      url: "/api/point/batchUpdatePoint",
      method: "POST",
      alertSuccess: true,
      params,
    });
  },
  //查询路径列表
  queryPathTable: (params) => {
    return request({
      url: "/api/pathMain/getPagePathMainList",
      method: "GET",
      alertSuccess: true,
      params,
    });
  },
  //删除路径
  deletePathData: (data) => {
    return request({
      url: "/api/pathMain/deleteByIds",
      method: "POST",
      alertSuccess: true,
      data,
    });
  },
  //新增路径
  addPathData: (data) => {
    return request({
      url: "/api/pathMain/insertPathMainList",
      method: "POST",
      alertSuccess: true,
      data,
    });
  },
  //修改路径
  updatePathData: (data) => {
    return request({
      url: "/api/pathMain/updateById",
      method: "POST",
      alertSuccess: true,
      data,
    });
  },
  //查询路径详情信息
  getPathDetailData: (params) => {
    return request({
      url: "/api/pathMain/" + params,
      method: "GET",
      alertSuccess: true,
    });
  },
  //查询理论路径详情信息
  getThePathDetailData: (params) => {
    return request({
      // url: "/api/theoretical_path/getTheoreticalPathPathMainPointList",
      url: "/api/pathDetail/queryPointCodeByThePathCode",
      method: "POST",
      params,
      alertSuccess: true,
    });
  },

  //查询路径下已绑定的点位数据
  getPathPoinDetailData: (params) => {
    return request({
      url: "/api/pathDetail/getPathDetailList",
      method: "GET",
      alertSuccess: true,
      params,
    });
  },
  //删除已绑定的点位
  deletePathPoinData: (data) => {
    return request({
      url: "/api/pathDetail/deletePathDetailList",
      method: "POST",
      alertSuccess: true,
      data,
    });
  },
  //新增路径下点位信息
  addPathPoinData: (data) => {
    return request({
      url: "/api/pathDetail/insertPathDetailList",
      method: "POST",
      alertSuccess: true,
      data,
    });
  },
  //修改路径下点位信息
  updatePathPoinData: (data) => {
    return request({
      url: "/api/pathDetail/updatePathDetailList",
      method: "POST",
      alertSuccess: true,
      data,
    });
  },
  //查询任务列表
  queryTaskTable: (params) => {
    return request({
      url: "/api/pathRegisterMain/getPagePathRegisterMainList",
      method: "GET",
      alertSuccess: true,
      params,
    });
  },
  //新增任务列表
  addTaskData: (data) => {
    return request({
      url: "/api/pathRegisterMain/insertPathRegisterMainList",
      method: "POST",
      alertSuccess: true,
      data,
    });
  },
  //修改任务列表
  updateTaskData: (data) => {
    return request({
      url: "/api/pathRegisterMain/updatePathRegisterMainList",
      method: "POST",
      alertSuccess: true,
      data,
    });
  },
  //删除任务列表
  deleteTaskData: (data) => {
    return request({
      url: "/api/pathRegisterMain/deletePathRegisterMainList",
      method: "POST",
      alertSuccess: true,
      data,
    });
  },
  //查询设备路径
  getPathMainPointEquipmentList: (params) => {
    return request({
      url: "/api/equipment/getPathMainPointEquipmentList",
      method: "GET",
      alertSuccess: true,
      params,
    });
  },
};
