import request from "@/common/request.js";

export default {
  // 分组分页查询 /sys_group/pageInfoSysGroup
  GroupPagingQuery: (params) => {
    return request({
      url: "/api/sys_group/pageInfoSysGroup",
      method: "GET",
      params,
    });
  },
  // 分组操作 新增 /sys_group/add
  GroupOperate: (data, type) => {
    return request({
      url: `/api/sys_group/${type}`,
      method: "POST",
      data,
    });
  },
  GroupDel: (params) => {
    return request({
      url: `/api/sys_group/del`,
      method: "POST",
      params,
    });
  },
  // /sys_group/getSysGroupList
  GroupList: () => {
    return request({
      url: `/api/sys_group/getSysGroupList`,
      method: "GET",
    });
  },
  // 程序分页查询
  PageInfoSysService: (params) => {
    return request({
      url: `/api/sys_service/pageInfoSysService`,
      method: "GET",
      params,
    });
  },
  // 程序子表分页查询
  PageInfoSysServiceDetail: (params) => {
    return request({
      url: `/api/sys_service/pageInfoSysServiceDetail`,
      method: "GET",
      params,
    });
  },
  // /sys_equipment_service/pageInfoSysEquipmentService
  PageInfoSysEquipmentService: (params) => {
    return request({
      url: `/api/sys_equipment_service/pageInfoSysEquipmentService`,
      method: "GET",
      params,
    });
  },
  // /sys_equipment_service/pageInfoSysEquipmentServiceDetail
  PageInfoSysEquipmentServiceDetail: (params) => {
    return request({
      url: `/api/sys_equipment_service_detail/pageInfoSysEquipmentServiceDetail`,
      method: "GET",
      params,
    });
  },
  // 第三方系统分页查询 /sys_third_system/pageInfoSysThirdSystem
  PageInfoSysThirdSystem: (params) => {
    return request({
      url: `/api/sys_third_system/pageInfoSysThirdSystem`,
      method: "GET",
      params,
    });
  },
  // 第三方系统新增 /sys_third_system/add
  SysThirdSystemAdd: (data) => {
    return request({
      url: `/api/sys_third_system/add`,
      method: "POST",
      data,
    });
  },
  // 第三方系统编辑 /sys_third_system/edit
  SysThirdSystemEdit: (data) => {
    return request({
      url: `/api/sys_third_system/edit`,
      method: "POST",
      data,
    });
  },
  // 第三方系统删除 /sys_third_system/del
  SysThirdSystemDel: (params) => {
    return request({
      url: `/api/sys_third_system/del`,
      method: "POST",
      params,
    });
  },
  // 理论路径分页查询 /theoretical_path/pageTheoreticalPath
  pageTheoreticalPath: (params) => {
    return request({
      url: `/api/theoretical_path/pageTheoreticalPath`,
      method: "GET",
      params,
    });
  },
  // 理论路径查询 /theoretical_path/theoreticalPathList
  theoreticalPathList: (params) => {
    return request({
      url: `/api/theoretical_path/theoreticalPathList`,
      method: "GET",
      params,
    });
  },
  // 理论路径新增 /theoretical_path/add
  addTheoreticalPath: (data) => {
    return request({
      url: `/api/theoretical_path/add`,
      method: "POST",
      data,
    });
  },
  // 理论路径编辑 /theoretical_path/edit
  editTheoreticalPath: (data) => {
    return request({
      url: `/api/theoretical_path/edit`,
      method: "POST",
      data,
    });
  },
  // 理论路径删除 /theoretical_path/del
  delTheoreticalPath: (params) => {
    return request({
      url: `/api/theoretical_path/del`,
      method: "POST",
      params,
    });
  },
    // 理论路径删除关联的路径设置 /batchUpdateByThePathId/del
  batchUpdateByThePathId: (params) => {
    return request({
        url: `/api/theoretical_path/deleteRelevancePath`,
        method: "PUT",
        params,
    });
  },
};
