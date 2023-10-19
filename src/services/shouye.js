import { https } from '@/utils/request'

//轮播图
export const lunboapi = (distributionSite = 1) => {
  return https({
    url: '/home/banner',
    data: {
      distributionSite,
    },
  })
}

//前台分类
export const fenleiapi = () => {
  return https({
    url: '/home/category/mutli',
  })
}

//热门推荐
export const hotapi = () => {
  return https({
    url: '/home/hot/mutli',
  })
}

//猜你喜欢
export const likeapi = (data) => {
  return https({
    url: '/home/goods/guessLike',

    data,
  })
}
