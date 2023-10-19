import { https } from '@/utils/request'

//热门推荐
export const hotzujianapi = (url, data) => {
  return https({
    url,
    data,
  })
}
