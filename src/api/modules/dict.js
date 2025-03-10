import request from '@/common/request.js'

export default {
  // 字典分页查询 /dictionaries/pageInfoDictionaries
  pageInfoDictionaries: (params) => {
    return request({
      url: `/api/dictionaries/pageInfoDictionaries`,
      method: 'GET',
      params
    })
  },
  // /api/dictionaries/getDictionariesFunctionList
  getDictionariesFunctionList: (params) => {
    return request({
      url: `/api/dictionaries/getDictionariesFunctionList`,
      method: 'GET',
      params
    })
  },
  // 字典新增 /dictionaries/add
  add: (data) => {
    return request({
      url: `/api/dictionaries/add`,
      method: 'POST',
      data
    })
  },
  // 字典编辑 /dictionaries/edit
  edit: (data) => {
    return request({
      url: `/api/dictionaries/edit`,
      method: 'POST',
      data
    })
  },
  // 字典删除 /dictionaries/del
  del: (params) => {
    return request({
      url: `/api/dictionaries/del`,
      method: 'POST',
      params
    })
  }
}
