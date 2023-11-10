<script setup>
import cartmian from './components/cartmian.vue'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
// console.log(safeAreaInsets)
const height = safeAreaInsets.bottom
// console.log(height)
//把height赋值传给子组件
</script>

<template>
  <cartmian :height="height"></cartmian>
</template>
