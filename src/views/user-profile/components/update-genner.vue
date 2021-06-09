<template>
  <div class="update-genner">
    <van-picker title="性别" :default-index="value" show-toolbar :columns="columns" @confirm="onConfirm" @cancel="onCancel" @change="onChange" />
  </div>
</template>
<script>
import { editUserProfile } from '@/API/user'
export default {
  name: 'UpdateGenner',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      columns: ['男', '女'],
      localGender: this.value
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
    async onConfirm (value, index) {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const localGender = this.localGender
        await editUserProfile({
          gender: localGender
        })
        // 更新视图
        this.$emit('input', localGender)
        // 关闭弹窗
        this.$emit('close')
        this.$toast.success('更新成功')

      } catch (error) {
        this.$toast.fail('出错了')
      }
    },
    onChange (picker, value, index) {
      this.localGender = index
    },
    onCancel () {
      this.$emit('close')
    }
  }
}

</script>

<style scoped lang="less">
.field-wrap {
  padding: 20px;
}
</style>