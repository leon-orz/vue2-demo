import request from '@/common/request.js'

export default {
  Login: (params) => {
    return request({
      url: `/api/user/user_login`,
      method: 'POST',
      withToken: false,
      params,
    })
  },
}
