import { https } from '@/utils/request'

//微信支付api
export const wxPayapi = (id) => {
  return https({
    url: '/pay/wxPay/miniPay',
    data: {
      orderId: id,
    },
  })
}

/**
 * 模拟支付-内测版
 * @param data orderId 订单id
 */
export const getPayMockAPI = (id) => {
  return https({
    method: 'GET',
    url: '/pay/mock',
    data: {
      orderId: id,
    },
  })
}
