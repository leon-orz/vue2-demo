import { useUserStore } from '@/stores/user'

// 是否有权限
export const hasAuth = (code = '') => {
  let auths = useUserStore().auths
  if (!auths) return false
  let authList = auths.map((item) => item.menuCode)
  if (typeof code === 'string') {
    if (code) {
      return authList.includes(code)
    } else {
      return true
    }
  } else {
    console.error('hasAuth: code 必须是字符串')
    return false
  }
}

// 是否有权限 router专用
export const hasAuthForRoute = (route) => {
  const auths = useUserStore().auths
  if (!auths) return false
  if (route) {
    if (route.meta) {
      return hasAuth(route.meta.auth)
    } else {
      return true
    }
  } else {
    console.error('hasAuthForRoute: route 不能为空')
    return false
  }
}

// 是否有权限
export const hasSome = (codes = []) => {
  const auths = useUserStore().auths
  if (!auths) return false
  if (Array.isArray(codes)) {
    for (let i = 0; i < codes.length; i++) {
      if (auths.includes(codes[i])) {
        return true
      }
    }
    return false
  } else {
    console.error('hasAuth: codes 必须是数组')
    return false
  }
}

// 是否有权限
export const hasEvery = (codes = []) => {
  const auths = useUserStore().auths
  if (!auths) return false
  if (Array.isArray(codes)) {
    for (let i = 0; i < codes.length; i++) {
      if (!auths.includes(codes[i])) {
        return false
      }
    }
    return true
  } else {
    console.error('hasAuth: codes 必须是数组')
    return false
  }
}
