import { https } from '@/utils/request'

//  新建地址/member/address
export const memberaddressapi = (data) => {
  return https({
    method: 'POST',
    url: '/member/address',
    data,
  })
}

//获取收货地址列表
// /member/address
export const getmemberaddressapi = () => {
  return https({
    url: '/member/address',
  })
}

/**
 * 获取收货地址详情
 * @param id 地址id(路径参数)
 */
export const getMemberAddressByIdAPI = (id) => {
  return https({
    method: 'GET',
    url: `/member/address/${id}`,
  })
}

//修改地址
export const xiugaidizhiapi = (id, data) => {
  return https({
    method: 'PUT',
    url: `/member/address/${id}`,
    data,
  })
}

//删除地址
export const deletememberaddressapi = (id) => {
  return https({
    method: 'DELETE',
    url: `/member/address/${id}`,
  })
}
