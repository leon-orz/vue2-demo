import request from '@/common/request'

/**
 * 用户登录认证接口
 * @param {Object} params - 登录凭证 {account: string, password: string}
 * @returns {Promise} 包含token的认证响应
 */
export const LoginApi = params => {
  return request({
    url: '/api/user/user_login',
    method: 'post',
    withToken: false,
    params,
  })
}
