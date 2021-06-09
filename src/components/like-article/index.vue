<template>
  <van-icon :color="value  ? '#e5645f':''" :name="value ?'good-job': 'good-job-o'" @click="onClick" :loading="loading" />
</template>

<script>
import { addLikeArticle, deleteLikeArticle } from '@/API/article'
export default {
  name: 'LikeArticle',
  props: {
    value: {
      type: [Number, Boolean],
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async onClick () {
      this.loading = true

      try {
        if (this.value) {
          // 已点赞,取消点赞
          await deleteLikeArticle(this.articleId)
          this.$toast.fail('取消点赞')
        }
        else {
          // 点赞
          await addLikeArticle(this.articleId)
          this.$toast.success('点赞成功')
        }
        this.$emit('input', !this.value)

      } catch (error) {
        this.$toast('操作失败,请稍后重试')
      }

      this.loading = false
    }
  }
}
</script>

<style>
</style>