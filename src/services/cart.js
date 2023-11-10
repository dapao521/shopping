import { https } from '@/utils/request'

//加入购物车
export const postcartapi = (data) => {
  return https({
    method: 'POST',
    url: '/member/cart',
    data,
  })
}

//获取购物车数据

export const getpostcartapi = () => {
  return https({
    url: '/member/cart',
  })
}

/**
 * 删除/清空购物车单品
 * @param data 请求体参数 ids SKUID 集合
 */
export const deleteMemberCartAPI = (data) => {
  return https({
    method: 'DELETE',
    url: '/member/cart',
    data,
  })
}

/**
 * 修改购物车单品
 * @param skuId SKUID
 * @param data selected 选中状态 count 商品数量
 */
export const putMemberCartBySkuIdAPI = (skuId, data) => {
  return https({
    method: 'PUT',
    url: `/member/cart/${skuId}`,
    data,
  })
}

/**
 * 购物车全选/取消全选
 * @param data selected 是否选中
 */
export const putMemberCartSelectedAPI = (data) => {
  return https({
    method: 'PUT',
    url: '/member/cart/selected',
    data,
  })
}
