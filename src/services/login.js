import { https } from '@/utils/request'

//微信正式小程序登陆
export const loginapi = (data) => {
  return https({
    method: 'POST',
    url: '//login/wxMin',
    data,
  })
}

//模拟小程序登陆
export const loginapi2 = (phoneNumber) => {
  return https({
    method: 'POST',
    url: '/login/wxMin/simple',
    data: {
      phoneNumber,
    },
  })
}
