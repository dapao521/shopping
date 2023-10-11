import { useMemberStore } from '@/stores'

const baseurl = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'
const httpInterceptor = {
  invoke(options) {
    if (!options.url.startsWith('http')) {
      options.url = baseurl + options.url
    }
    options.timeout = 5000

    options.header = {
      ...options.header,
      'source-client': 'miniapp',
    }
    //获取本地缓存中的token
    const memberstore = useMemberStore()
    const token = memberstore.profile?.token
    if (token) {
      options.header.Authorization = token
    }
  },
}
// 拦截 request 请求
uni.addInterceptor('request', httpInterceptor)
// 拦截 uploadFile 文件上传
uni.addInterceptor('uploadFile', httpInterceptor)

/**
 * 请求函数
 * @param  UniApp.RequestOptions
 * @returns Promise
 *  1. 返回 Promise 对象，用于处理返回值类型
 *  2. 获取数据成功
 *    2.1 提取核心数据 res.data
 *
 *  3. 获取数据失败
 *    3.1 401错误  -> 清理用户信息，跳转到登录页
 *    3.2 其他错误 -> 根据后端错误信息轻提示
 *    3.3 网络错误 -> 提示用户换网络
 */

export const https = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)

          // 3.1 401错误  -> 清理用户信息，跳转到登录页
        } else if (res.statusCode === 401) {
          const memberstore = useMemberStore()
          memberstore.clearProfile()
          uni.navigateTo({
            url: '/pages/login/login',
          })
          reject(res)
        } else {
          // 3.2 其他错误 -> 根据后端错误信息轻提示
          uni.showToast({
            title: res.data.msg || '请求失败',
            icon: 'none',
          })
          reject(res)
        }
      },
      fail(err) {
        // 3.3 网络错误 -> 提示用户换网络
        uni.showToast({
          title: '网络错误，换个网络试试',
          icon: 'none',
        })
        reject(err)
      },
    })
  })
}
