<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { goodsapi } from '@/services/shangpingxiangqing.js'
import DizhiZujian from '@/pages/goods/components/DizhiZujian.vue'
import FuwuZujian from './components/FuwuZujian.vue'
import { computed } from 'vue'
import { postcartapi } from '@/services/cart.js'
import { getmemberaddressapi } from '@/services/address.js'
import { useadressstore } from '@/stores/modules/address'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

//获取传过来的id
const query = defineProps({
  id: String,
})
// console.log(query)

//获取数据
const goodslist = ref()
const getgoodslist = async () => {
  const { result } = await goodsapi(query.id)
  // console.log(result)
  goodslist.value = result

  //sku组件所需的格式
  localdata.value = {
    _id: result.id,
    name: result.name,
    goods_thumb: result.mainPictures[0],
    spec_list: result.specs.map((item) => ({
      name: item.name,
      list: item.values,
    })),
    sku_list: result.skus.map((item) => ({
      _id: item.id,
      goods_id: result.id,
      goods_name: result.name,
      image: item.picture,
      price: item.price * 100,
      stock: item.inventory,
      sku_name_arr: item.specs.map((itemtoo) => itemtoo.valueName),
    })),
  }
}

//老师写的
// SKU组件所需格式
//   localdata.value = {
//     _id: res.result.id,
//     name: res.result.name,
//     goods_thumb: res.result.mainPictures[0],
//     spec_list: res.result.specs.map((v) => ({ name: v.name, list: v.values })),
//     sku_list: res.result.skus.map((v) => ({
//       _id: v.id,
//       goods_id: res.result.id,
//       goods_name: res.result.name,
//       image: v.picture,
//       price: v.price * 100, // 注意：需要乘以 100
//       stock: v.inventory,
//       sku_name_arr: v.specs.map((vv) => vv.valueName),
//     })),
//   }
// }

//轮播图切换

const lunboxiabiao = ref(0)
const onchange = (e) => {
  // console.log(e.detail.current)
  lunboxiabiao.value = e.detail.current
}

// 点击大图预览
const ontapimage = (item) => {
  // console.log('点击大图预览')
  uni.previewImage({
    // 当前显示图片的链接/索引值
    current: item,
    // 需要预览的图片链接列表
    urls: goodslist.value?.mainPictures,
    // 是否可循环预览
    loop: true,
  })
}

//弹出层实例获取
const popup = ref()
// console.log(popup)
//通过点击不同的view打开不同的弹出层
const popupname = ref()
//选择打开弹出层
const onopen = (type) => {
  popupname.value = type
  popup.value.open()
}

onLoad(() => {
  getgoodslist()
})

// sku弹框   他妈的找了老子半天的错误  总结以下几点
// 原本的sku两个组件  也就是compononts 里面的   不要保存修改   B事特别多
//获取sku弹框
const skuPopup = ref()
//sku模式
const skuMode = ref()
//是否显示sku
const skuKey = ref(false)
//商品信息 和 后段的goodslist格式不同
const localdata = ref()
//打开sku弹框
const onOpenSkuPopup = (a) => {
  //开启sku
  skuKey.value = true
  //修改mode
  skuMode.value = a
}

//加入购物车
const addCart = async (e) => {
  // console.log(e)
  await postcartapi({ skuId: e._id, count: e.buy_num })
  uni.showToast({
    title: '添加成功',
  })
  skuKey.value = false
}
//立即购买
const buyNow = (e) => {
  // console.log(e)
  uni.navigateTo({ url: `/pagesOrder/create/create?skuId=${e._id}&count=${e.buy_num}` })
}
//计算被选中的值
const arrtext = computed(() => {
  // console.log(skuPopup.value)
  return skuPopup.value?.selectArr.join(' ').trim() || '请你吃屎'
})

//获取收获地址列表
const address = ref()
const getaddress = async () => {
  const { result } = await getmemberaddressapi()
  // console.log(result)
  address.value = result
}
onLoad(() => {
  getaddress()
})

//每次关闭重新赋值
const adressstore = useadressstore()
let dizhi = ref()
dizhi.value = adressstore?.address.fullLocation + adressstore?.address.address
const closeq = () => {
  popup.value.close()
  dizhi.value = adressstore?.address.fullLocation + adressstore?.address.address
}
</script>

<template>
  <!-- sku弹框 -->
  <vk-data-goods-sku-popup
    ref="skuPopup"
    v-model="skuKey"
    border-radius="20"
    add-cart-background-color="#ffa868"
    buy-now-background-color="#27ba98"
    :actived-style="{
      color: '#27BA9B',
      borderColor: '#27BA9B',
      backgroundColor: '#E9F8F5',
    }"
    :localdata="localdata"
    :mode="skuMode"
    @add-cart="addCart"
    @buy-now="buyNow"
  ></vk-data-goods-sku-popup>

  <scroll-view scroll-y class="viewport">
    <!-- 基本信息 -->
    <view class="goods">
      <!-- 商品主图 -->
      <view class="preview">
        <swiper :circular="true" :autoplay="true" :interval="1000" @change="onchange">
          <swiper-item v-for="item in goodslist?.mainPictures" :key="item">
            <image @tap="ontapimage(item)" mode="aspectFill" :src="item" />
          </swiper-item>
        </swiper>
        <view class="indicator">
          <text class="current">{{ lunboxiabiao + 1 }}</text>
          <text class="split">/</text>
          <text class="total">{{ goodslist?.mainPictures.length }}</text>
        </view>
      </view>

      <!-- 商品简介 -->
      <view class="meta">
        <view class="price">
          <text class="symbol">¥</text>
          <text class="number">{{ goodslist?.price }}</text>
        </view>
        <view class="name ellipsis" user-select="true">{{ goodslist?.name }} </view>
        <view class="desc"> {{ goodslist?.desc }} </view>
      </view>

      <!-- 操作面板 -->
      <view class="action">
        <view class="item arrow" @tap="onOpenSkuPopup(1)">
          <text class="label">选择</text>
          <text class="text ellipsis"> {{ arrtext }} </text>
        </view>
        <view class="item arrow">
          <text class="label">送至</text>
          <text class="text ellipsis" @tap="onopen('dizhi')">
            {{ adressstore.address ? dizhi : '请选择收货地址' }}
          </text>
        </view>
        <view class="item arrow">
          <text class="label">服务</text>
          <text @tap="onopen('fuwu')" class="text ellipsis"> 无忧退 快速退款 免费包邮 </text>
        </view>
      </view>
    </view>

    <!-- 商品详情 -->
    <view class="detail panel">
      <view class="title">
        <text>详情</text>
      </view>
      <view class="content">
        <view class="properties">
          <!-- 属性详情 -->
          <view class="item" v-for="item in goodslist?.details.properties" :key="item.name">
            <text class="label" user-select="true">{{ item.name }}</text>
            <text class="value">{{ item.value }}</text>
          </view>
        </view>
        <!-- 图片详情 -->
        <image
          v-for="item in goodslist?.details.pictures"
          :key="item"
          mode="widthFix"
          :src="item"
        ></image>
      </view>
    </view>

    <!-- 同类推荐 -->
    <view class="similar panel">
      <view class="title">
        <text>同类推荐</text>
      </view>
      <view class="content">
        <navigator
          v-for="item in goodslist?.similarProducts"
          :key="item.id"
          class="goods"
          hover-class="none"
          :url="`/pages/goods/goods?id=${item.id}`"
        >
          <image class="image" mode="aspectFill" :src="item.picture"></image>
          <view class="name ellipsis">{{ item.name }}</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ item.price }}</text>
          </view>
        </navigator>
      </view>
    </view>
  </scroll-view>

  <!-- 用户操作 -->
  <view class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
    <view class="icons">
      <button class="icons-button"><text class="icon-heart"></text>收藏</button>
      <button class="icons-button" open-type="contact">
        <text class="icon-handset"></text>客服
      </button>
      <navigator class="icons-button" url="/pages/cart/cart2" open-type="navigate">
        <text class="icon-cart"></text>购物车
      </navigator>
    </view>
    <view class="buttons">
      <view class="addcart" @tap="onOpenSkuPopup(2)"> 加入购物车 </view>
      <view class="buynow" @tap="onOpenSkuPopup(3)"> 立即购买 </view>
    </view>
  </view>

  <!-- uni 弹出层 -->
  <uni-popup ref="popup" type="bottom" background-color="#fff">
    <DizhiZujian v-if="popupname === 'dizhi'" @close="closeq" :address="address"></DizhiZujian>
    <FuwuZujian v-if="popupname === 'fuwu'" @close="closeq"></FuwuZujian>
  </uni-popup>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.viewport {
  background-color: #f4f4f4;
}

.panel {
  margin-top: 20rpx;
  background-color: #fff;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 90rpx;
    line-height: 1;
    padding: 30rpx 60rpx 30rpx 6rpx;
    position: relative;
    text {
      padding-left: 10rpx;
      font-size: 28rpx;
      color: #333;
      font-weight: 600;
      border-left: 4rpx solid #27ba9b;
    }
    navigator {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.arrow {
  &::after {
    position: absolute;
    top: 50%;
    right: 30rpx;
    content: '\e6c2';
    color: #ccc;
    font-family: 'erabbit' !important;
    font-size: 32rpx;
    transform: translateY(-50%);
  }
}

/* 商品信息 */
.goods {
  background-color: #fff;
  .preview {
    height: 750rpx;
    position: relative;
    .image {
      width: 750rpx;
      height: 750rpx;
    }
    .indicator {
      height: 40rpx;
      padding: 0 24rpx;
      line-height: 40rpx;
      border-radius: 30rpx;
      color: #fff;
      font-family: Arial, Helvetica, sans-serif;
      background-color: rgba(0, 0, 0, 0.3);
      position: absolute;
      bottom: 30rpx;
      right: 30rpx;
      .current {
        font-size: 26rpx;
      }
      .split {
        font-size: 24rpx;
        margin: 0 1rpx 0 2rpx;
      }
      .total {
        font-size: 24rpx;
      }
    }
  }
  .meta {
    position: relative;
    border-bottom: 1rpx solid #eaeaea;
    .price {
      height: 130rpx;
      padding: 25rpx 30rpx 0;
      color: #fff;
      font-size: 34rpx;
      box-sizing: border-box;
      background-color: #35c8a9;
    }
    .number {
      font-size: 56rpx;
    }
    .brand {
      width: 160rpx;
      height: 80rpx;
      overflow: hidden;
      position: absolute;
      top: 26rpx;
      right: 30rpx;
    }
    .name {
      max-height: 88rpx;
      line-height: 1.4;
      margin: 20rpx;
      font-size: 32rpx;
      color: #333;
    }
    .desc {
      line-height: 1;
      padding: 0 20rpx 30rpx;
      font-size: 24rpx;
      color: #cf4444;
    }
  }
  .action {
    padding-left: 20rpx;
    .item {
      height: 90rpx;
      padding-right: 60rpx;
      border-bottom: 1rpx solid #eaeaea;
      font-size: 26rpx;
      color: #333;
      position: relative;
      display: flex;
      align-items: center;
      &:last-child {
        border-bottom: 0 none;
      }
    }
    .label {
      width: 60rpx;
      color: #898b94;
      margin: 0 16rpx 0 10rpx;
    }
    .text {
      flex: 1;
      -webkit-line-clamp: 1;
    }
  }
}

/* 商品详情 */
.detail {
  padding-left: 20rpx;
  .content {
    margin-left: -20rpx;
    .image {
      width: 100%;
    }
  }
  .properties {
    padding: 0 20rpx;
    margin-bottom: 30rpx;
    .item {
      display: flex;
      line-height: 2;
      padding: 10rpx;
      font-size: 26rpx;
      color: #333;
      border-bottom: 1rpx dashed #ccc;
    }
    .label {
      width: 200rpx;
    }
    .value {
      flex: 1;
    }
  }
}

/* 同类推荐 */
.similar {
  .content {
    padding: 0 20rpx 200rpx;
    background-color: #f4f4f4;
    display: flex;
    flex-wrap: wrap;
    .goods {
      width: 340rpx;
      padding: 24rpx 20rpx 20rpx;
      margin: 20rpx 7rpx;
      border-radius: 10rpx;
      background-color: #fff;
    }
    .image {
      width: 300rpx;
      height: 260rpx;
    }
    .name {
      height: 80rpx;
      margin: 10rpx 0;
      font-size: 26rpx;
      color: #262626;
      text-align: center;
    }
    .price {
      line-height: 1;
      font-size: 20rpx;
      color: #cf4444;
      // 字体居中
      text-align: center;
    }
    .number {
      font-size: 26rpx;
      margin-left: 2rpx;
    }
  }
  navigator {
    &:nth-child(even) {
      margin-right: 0;
    }
  }
}

/* 底部工具栏 */
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background-color: #fff;
  height: 100rpx;
  padding: 0 20rpx var(--window-bottom);
  border-top: 1rpx solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;
  .buttons {
    display: flex;
    & > view {
      width: 220rpx;
      text-align: center;
      line-height: 72rpx;
      font-size: 26rpx;
      color: #fff;
      border-radius: 72rpx;
    }
    .addcart {
      background-color: #ffa868;
    }
    .buynow,
    .payment {
      background-color: #27ba9b;
      margin-left: 20rpx;
    }
  }
  .icons {
    padding-right: 10rpx;
    display: flex;
    align-items: center;
    flex: 1;
    .icons-button {
      flex: 1;
      text-align: center;
      line-height: 1.4;
      padding: 0;
      margin: 0;
      border-radius: 0;
      font-size: 20rpx;
      color: #333;
      background-color: #fff;
      &::after {
        border: none;
      }
    }
    text {
      display: block;
      font-size: 34rpx;
    }
  }
}
</style>
