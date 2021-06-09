<template>
  <van-button v-if="isFollowed" round size="small" @click="onFollow" :loading="loading">已关注</van-button>
  <van-button v-else type="info" color="#3296fa" round size="small" icon="plus" @click="onFollow" :loading="loading">关注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/API/user'
export default {
  name: 'FollowUser',
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false,

    }
  },
  methods: {
    async onFollow () {
      this.loading = true
      try {

        if (this.isFollowed) {
          // 已经关注  取消关注
          await deleteFollow(this.userId)

        } else {
          // 没有关注 , 添加关注 
          await addFollow(this.userId)
        }
        this.$emit('update-is_followed', !this.isFollowed)

      } catch (error) {
        let message = '操作失败,请重试'
        if (error.response && error.response.status === 400) {
          message = '你不能关注你自己'
        }
        this.$toast(message)
      }
      this.loading = false
    }
  }
}
</script>

<style>
</style>