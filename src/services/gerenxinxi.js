import { https } from '../utils/request'

//获取个人信息
export const getGerenxinxiapi = () => {
  return https({
    url: '/member/profile',
  })
}

//修改个人信息
export const setGerenxinxiapi = (data) => {
  return https({
    url: '/member/profile',
    method: 'PUT',
    data,
  })
}
