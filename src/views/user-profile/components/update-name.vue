<template>
  <div class="update-name">
    <van-nav-bar title="设置昵称" left-text='取消' right-text='完成' @click-right="editUserProfile" @click-left="$emit('close')"> </van-nav-bar>
    <div class="field-wrap">
      <van-field v-model.trim="message" rows="2" autosize type="textarea" maxlength="7" placeholder="请输入昵称" show-word-limit />
    </div>

  </div>
</template>

<script>
import { editUserProfile } from '@/API/user'
export default {
  name: 'UpdateName',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      message: this.value
    }
  },
  components: {

  },
  computed: {},
  watch: {},
  created () {
  },
  mounted () { },
  methods: {
    async editUserProfile () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0 //持续展示
      })
      try {
        const message = this.message
        if (!message.length) {
          this.$$toast('昵称不能为空')
        }
        await editUserProfile({
          name: message
        })
        // 更新视图
        this.$emit('input', message)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新完成')
      } catch (error) {
        this.$toast('发生了一些错误')
      }
    }
  }
}
</script>

<style scoped lang="less">
.field-wrap {
  padding: 20px;
}
</style>
