<script setup lang="ts">
import { useMemberStore } from '@/stores'
import { https } from '@/utils/request'

const memberStore = useMemberStore()

const getdata = async () => {
  const res = await https({
    method: 'GET',
    url: '/member/profile',
  })
  console.log(res)
}
</script>

<template>
  <view class="my">
    <view>会员信息：{{ memberStore.profile }}</view>
    <button
      @tap="
        memberStore.setProfile({
          nickname: '黑马先锋',
          token: '123413252314523523',
        })
      "
      size="mini"
      plain
      type="primary"
    >
      保存用户信息
    </button>
    <button @tap="memberStore.clearProfile()" size="mini" plain type="warn">清理用户信息</button>
    <button @click="getdata">获取用户信息</button>
  </view>
</template>

<style lang="scss">
//
</style>
