import request from '@/common/request.js'

export default {
  // pathDetail/queryListByParam
  pathDetailQueryListByParam: (data) => {
    return request({
      url: '/api/pathDetail/queryListByParam',
      method: 'POST',
      data
    })
  },
  // /pathDetail/insertPathDetailList
  insertPathDetailList: (data) => {
    return request({
      url: '/api/pathDetail/insertPathDetailList',
      method: 'POST',
      data
    })
  },
  // updateById 修改
  updateById: (data) => {
    return request({
      url: '/api/pathDetail/updateById',
      method: 'POST',
      data
    })
  },
  // deleteByIds 删除
  deleteByIds: (data) => {
    return request({
      url: '/api/pathDetail/deleteByIds',
      method: 'POST',
      data
    })
  },
  // point/getPagePointList
  getPagePointList: (params) => {
    return request({
      url: '/api/point/getPagePointList',
      method: 'GET',
      params
    })
  },
  // equipment/PathNameBoardVO
  PathNameBoardVO: (params) => {
    return request({
      url: '/api/equipment/PathNameBoardVO',
      method: 'GET',
      params
    })
  }
}
