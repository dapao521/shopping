<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import CustomNavbar from '@/components/CustomNavbar.vue'
import XtxSwiper from '@/components/XtxSwiper.vue'
import XtxGuess from '@/components/XtxGuess.vue'
import { lunboapi, fenleiapi, hotapi } from '@/services/shouye.js'
import CategoryPanel from '@/pages/index/components/CategoryPanel.vue'
import HotPanel from '@/pages/index/components/HotPanel.vue'
import Gujia from '@/pages/index/components/Gujia.vue'

// 轮播图
const swiperList = ref([])
const getSwiperList = async () => {
  const res = await lunboapi()
  swiperList.value = res.result
  // console.log(res.result)
}

//前台分类
const categoryList = ref([])
const getCategoryList = async () => {
  const res = await fenleiapi()
  categoryList.value = res.result
  // console.log(res.result)
}

//热门推荐
const hotList = ref([])
const getHotList = async () => {
  const res = await hotapi()
  hotList.value = res.result
  // console.log(res.result)
}

//是否显示骨架
const gujia = ref(true)
onLoad(() => {
  gujia.value = true
  Promise.all([getSwiperList(), getCategoryList(), getHotList()])

  gujia.value = false
})

//获取XtxGuess组件实例
const likeList = ref()
//滚动刷新
const onscrolltolower = () => {
  // console.log('滚动到底部')
  // console.log(likeList.value.getLikeList())
  likeList.value?.getLikeList()
}

// 下拉刷新
const isxiala = ref(false)
const onrefresherrefresh = async () => {
  // console.log('下拉刷新')
  isxiala.value = true
  // getSwiperList()
  // getCategoryList()
  // getHotList()

  //调用猜你喜欢中组件重置数据方法
  likeList.value?.resetData()
  await Promise.all([
    getSwiperList(),
    getCategoryList(),
    getHotList(),
    likeList.value?.getLikeList(),
  ])
  isxiala.value = false
}
</script>

<template>
  <CustomNavbar></CustomNavbar>
  <scroll-view
    refresher-enabled
    @refresherrefresh="onrefresherrefresh"
    :refresher-triggered="isxiala"
    scroll-y
    class="scroll-view"
    @scrolltolower="onscrolltolower"
  >
    <Gujia v-if="gujia"></Gujia>
    <template v-else>
      <XtxSwiper :list="swiperList"></XtxSwiper>
      <CategoryPanel :categoryList="categoryList"></CategoryPanel>
      <HotPanel :hotList="hotList"></HotPanel>
      <XtxGuess ref="likeList"></XtxGuess>
    </template>
  </scroll-view>
</template>

<style lang="scss">
page {
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.scroll-view {
  flex: 1;
}
</style>
