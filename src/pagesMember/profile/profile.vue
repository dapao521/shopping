<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getGerenxinxiapi, setGerenxinxiapi } from '@/services/gerenxinxi'
import { useMemberStore } from '@/stores'
import console from 'console'
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

//获取数据
const gerenxinxi = ref()
const getGerenxinxi = async () => {
  const { result } = await getGerenxinxiapi()
  gerenxinxi.value = result
  // console.log(gerenxinxi.value)
}

onLoad(() => {
  getGerenxinxi()
})

const memberStore = useMemberStore()
//修改头像
const ongaitouxiang = () => {
  //调用拍照或选择图片
  uni.chooseImage({
    //文件个数
    count: 1,
    type: 'image',
    success: (res) => {
      // console.log(res.tempFilePaths)
      const tempFilePaths = res.tempFilePaths[0]
      //文件上传
      uni.uploadFile({
        url: '/member/profile/avatar',
        name: 'file',
        filePath: tempFilePaths,
        success: (success) => {
          // console.log(success)
          // 判断是否上传成功
          if (success.statusCode === 200) {
            //提取头像
            const avatar = JSON.parse(success.data).result
            //修改头像
            gerenxinxi.value.avatar = avatar
            //更新store头像

            memberStore.profile.avatar = avatar
            //提示成功
            uni.showToast({
              icon: 'none',
              title: '修改成功',
            })
          } else {
            uni.showToast({
              icon: 'none',
              title: '修改失败',
            })
          }
        },
      })
    },
  })
}

//点击保存修改表单
// const form = ref({
//   nickname: '',
//   gender: '',
//   birthday: '',
//   //职业
//   profession: '',

//   // 省份编码
//   provinceCode: '',
//   // 城市编码
//   cityCode: '',
//   // 地区编码
//   countyCode: '',
// })

//获取性别  第一种方法
// 第二种方法  直接在组件中  用event
// const ongender = (e) => {
//   gerenxinxi.value.gender = e.detail.value
// }

//获取城市编码   只能用第一种方法
let cityCode = ['', '', '']
const onfullLocation = (e) => {
  // console.log(e)
  gerenxinxi.value.fullLocation = e.detail.value.join(' ')
  cityCode = e.detail.code
}
const setGerenxinxi = async () => {
  const { nickname, gender, birthday, profession } = gerenxinxi.value
  const { result } = await setGerenxinxiapi({
    nickname,
    gender,
    birthday,
    profession,
    provinceCode: cityCode[0],
    cityCode: cityCode[1],
    countyCode: cityCode[2],
  })
  // console.log(result)
  //保存到store
  memberStore.profile.nickname = result.nickname
  uni.showToast({
    icon: 'none',
    title: '修改成功',
  })
  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
}
</script>

<template>
  <view class="viewport">
    <!-- 导航栏 -->
    <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
      <navigator open-type="navigateBack" class="back icon-left" hover-class="none"></navigator>
      <view class="title">个人信息</view>
    </view>
    <!-- 头像 -->
    <view class="avatar">
      <view class="avatar-content" @tap="ongaitouxiang">
        <image class="image" :src="gerenxinxi?.avatar" mode="aspectFill" />
        <text class="text">点击修改头像</text>
      </view>
    </view>
    <!-- 表单 -->
    <view class="form">
      <!-- 表单内容 -->
      <view class="form-content">
        <view class="form-item">
          <text class="label">账号</text>
          <text class="account">{{ gerenxinxi?.account }}</text>
        </view>
        <view class="form-item">
          <text class="label">昵称</text>
          <input
            class="input"
            type="text"
            placeholder=" 请填写昵称"
            :value="gerenxinxi?.nickname"
            @input="gerenxinxi.nickname = $event.detail.value"
          />
        </view>
        <view class="form-item">
          <text class="label">性别</text>
          <!-- @change 监听事件改变-->
          <radio-group @change="gerenxinxi.gender = $event.detail.value">
            <label class="radio">
              <radio value="男" color="#27ba9b" :checked="gerenxinxi?.gender === '男'" />
              男
            </label>
            <label class="radio">
              <radio value="女" color="#27ba9b" :checked="gerenxinxi?.gender === '女'" />
              女
            </label>
          </radio-group>
        </view>
        <view class="form-item">
          <text class="label">生日</text>
          <picker
            class="picker"
            mode="date"
            start="1900-01-01"
            :end="new Date()"
            :value="gerenxinxi?.birthday"
            @change="gerenxinxi.birthday = $event.detail.value"
          >
            <!-- @change 监听事件改变-->
            <view v-if="gerenxinxi?.birthday">{{ gerenxinxi?.birthday }}</view>
            <view class="placeholder" v-else> 请选择生日</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">城市</text>
          <picker
            class="picker"
            mode="region"
            :value="gerenxinxi?.fullLocation.split(' ')"
            @change="onfullLocation"
          >
            <view v-if="gerenxinxi?.fullLocation">{{ gerenxinxi?.fullLocation }}</view>
            <view class="placeholder" v-else> 请选择城市</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">职业</text>
          <input
            class="input"
            type="text"
            placeholder="请填写职业"
            :value="gerenxinxi?.profession"
            @input="gerenxinxi.profession = $event.detail.value"
          />
          <!-- @change 监听事件改变-->
        </view>
      </view>
      <!-- 提交按钮 -->
      <button class="form-button" @tap="setGerenxinxi">保 存</button>
    </view>
  </view>
</template>

<style lang="scss">
page {
  background-color: #f4f4f4;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/order_bg.png);
  background-size: auto 420rpx;
  background-repeat: no-repeat;
}

// 导航栏
.navbar {
  position: relative;

  .title {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
  }

  .back {
    position: absolute;
    height: 40px;
    width: 40px;
    left: 0;
    font-size: 20px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

// 头像
.avatar {
  text-align: center;
  width: 100%;
  height: 260rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    background-color: #eee;
  }

  .text {
    display: block;
    padding-top: 20rpx;
    line-height: 1;
    font-size: 26rpx;
    color: #fff;
  }
}

// 表单
.form {
  background-color: #f4f4f4;

  &-content {
    margin: 20rpx 20rpx 0;
    padding: 0 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }

  &-item {
    display: flex;
    height: 96rpx;
    line-height: 46rpx;
    padding: 25rpx 10rpx;
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #ddd;

    &:last-child {
      border: none;
    }

    .label {
      width: 180rpx;
      color: #333;
    }

    .account {
      color: #666;
    }

    .input {
      flex: 1;
      display: block;
      height: 46rpx;
    }

    .radio {
      margin-right: 20rpx;
    }

    .picker {
      flex: 1;
    }
    .placeholder {
      color: #808080;
    }
  }

  &-button {
    height: 80rpx;
    text-align: center;
    line-height: 80rpx;
    margin: 30rpx 20rpx;
    color: #fff;
    border-radius: 80rpx;
    font-size: 30rpx;
    background-color: #27ba9b;
  }
}
</style>
