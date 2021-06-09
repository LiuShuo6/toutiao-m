<template>
  <div class="update-birthday">
    <van-datetime-picker v-model="currentDate" type="date" title="选择年月日" @cancel="$emit('close')" @confirm="onConfirm" :min-date="minDate" :max-date="maxDate" />
  </div>
</template>

<script>
import { editUserProfile } from '@/API/user'
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirth',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value),
    }
  },
  components: {

  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    async onConfirm (value, index) {

      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
        console.log(currentDate);
        await editUserProfile({
          genderbirthday: currentDate
        })
        // 更新视图
        this.$emit('input', currentDate)
        // 关闭弹窗
        this.$emit('close')
        this.$toast.success('更新成功')

      } catch (error) {
        this.$toast.fail('出错了')
      }
    },
  }
}
</script>

<style scoped lang="less">
</style>
