import { https } from '@/utils/request'

export const goodsapi = (id) => {
  return https({
    url: '/goods',
    data: {
      id,
    },
  })
}
