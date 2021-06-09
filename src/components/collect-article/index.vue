<template>
  <van-icon :color="value ? '#ffa500':''" :name="value ?'star': 'star-o'" @click="onClick" :loading="loading" />

</template>

<script>
import { addCollect, deleteCollect } from '@/API/article'
export default {
  name: 'CollectArticle',
  model: {

  },
  props: {
    value: {
      type: Boolean,
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
        // 判断如果this.value
        if (this.value) {
          // 已收藏  取消收藏
          await deleteCollect(this.articleId)
        } else {
          // 没有收藏,添加收藏
          await addCollect(this.articleId)
        }
        // 更新视图
        this.$emit('input', !this.value)
        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')

      } catch (error) {
        console.log(error);
        this.$toast.fail('操作失败,请重试')
      }

      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>