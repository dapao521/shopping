import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useadressstore = defineStore(
  'address',
  () => {
    const address = ref()
    const setaddress = (data) => {
      address.value = data
    }

    return {
      address,
      setaddress,
    }
  },
  {
    persist: {
      storage: {
        setItem(key, value) {
          uni.setStorageSync(key, value)
        },
        getItem(key) {
          return uni.getStorageSync(key)
        },
      },
    },
  },
)
