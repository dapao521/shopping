<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { hotzujianapi } from '@/services/hot.js'
// 热门推荐页 标题和url
const hotMap = [
  { type: '1', title: '特惠推荐', url: '/hot/preference' },
  { type: '2', title: '爆款推荐', url: '/hot/inVogue' },
  { type: '3', title: '一站买全', url: '/hot/oneStop' },
  { type: '4', title: '新鲜好物', url: '/hot/new' },
]
//uniapp获取页面参数
const qurey = defineProps({
  type: {
    type: String,
  },
})
// console.log(qurey)
//设置标题
uni.setNavigationBarTitle({ title: hotMap[qurey.type - 1].title })
const url = hotMap[qurey.type - 1].url
//获取数据
const bannerPicture = ref()
const hotshuju = ref()
const gethotapi = async () => {
  const res = await hotzujianapi(url)
  // console.log(res.result)
  bannerPicture.value = res.result.bannerPicture
  hotshuju.value = res.result.subTypes
}

onLoad(() => {
  gethotapi()
})

//下标高亮
const xiabiao = ref(0)

// 分页加载
// 结束条件
const end = ref(false)
const onscrolltolower = async () => {
  // 获取当前选项
  const item = hotshuju.value[xiabiao.value]
  // console.log(item)
  // 加载下一页数据
  if (item.goodsItems.page * item.goodsItems.pageSize >= item.goodsItems.total) {
    end.value = false
    item.goodsItems.page++
  } else {
    end.value = true
    return uni.showToast({
      icon: 'none',
      title: '没有更多数据~',
    })
  }

  const { result } = await hotzujianapi(url, {
    subType: item.id,
    pageSize: item.goodsItems.pageSize,
    page: item.goodsItems.page,
  })
  // console.log(result)
  item.goodsItems.items.push(...result.subTypes[xiabiao.value].goodsItems.items)
}
</script>

<template>
  <view class="viewport">
    <!-- 推荐封面图 -->
    <view class="cover">
      <image :src="bannerPicture"></image>
    </view>
    <!-- 推荐选项 -->
    <view class="tabs">
      <text
        v-for="(item, index) in hotshuju"
        :key="item.id"
        class="text"
        :class="{ active: index === xiabiao }"
        @tap="xiabiao = index"
        >{{ item.title }}</text
      >
    </view>
    <!-- 推荐列表 -->
    <scroll-view
      scroll-y
      class="scroll-view"
      v-for="(item, index) in hotshuju"
      :key="item.id"
      v-show="xiabiao === index"
      @scrolltolower="onscrolltolower"
    >
      <view class="goods">
        <navigator
          hover-class="none"
          class="navigator"
          v-for="goods in item.goodsItems.items"
          :key="goods.id"
          :url="`/pages/goods/goods?id=${goods.id}`"
        >
          <image class="thumb" :src="goods.picture"></image>
          <view class="name ellipsis">{{ goods.name }} </view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ goods.price }}</text>
          </view>
        </navigator>
      </view>
      <view class="loading-text">{{ end ? '没有更多数据~' : '加载中...' }}</view>
    </scroll-view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  background-color: #f4f4f4;
}
.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 180rpx 0 0;
  position: relative;
}
.cover {
  width: 750rpx;
  height: 225rpx;
  border-radius: 0 0 40rpx 40rpx;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
}
.scroll-view {
  flex: 1;
}
.tabs {
  display: flex;
  justify-content: space-evenly;
  height: 100rpx;
  line-height: 90rpx;
  margin: 0 20rpx;
  font-size: 28rpx;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 5rpx rgba(200, 200, 200, 0.3);
  color: #333;
  background-color: #fff;
  position: relative;
  z-index: 9;
  .text {
    margin: 0 20rpx;
    position: relative;
  }
  .active {
    &::after {
      content: '';
      width: 40rpx;
      height: 4rpx;
      transform: translate(-50%);
      background-color: #27ba9b;
      position: absolute;
      left: 50%;
      bottom: 24rpx;
    }
  }
}
.goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx 20rpx;
  .navigator {
    width: 345rpx;
    padding: 20rpx;
    margin-top: 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }
  .thumb {
    width: 305rpx;
    height: 305rpx;
  }
  .name {
    height: 88rpx;
    font-size: 26rpx;
    // 字体居中
    text-align: center;
  }
  .price {
    line-height: 1;
    color: #cf4444;
    font-size: 30rpx;
    text-align: center;
  }
  .symbol {
    font-size: 70%;
  }
  .decimal {
    font-size: 70%;
  }
}

.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0 50rpx;
}
</style>
