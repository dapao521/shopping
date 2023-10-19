import { https } from '@/utils/request'

export const categorytopapi = () => {
  return https({
    url: '/category/top',
  })
}
