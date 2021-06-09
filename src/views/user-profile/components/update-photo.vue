<template>
  <div class="update-photo"> <img class="img" :src="img" alt="" ref="img">
    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';
import { updateUserPhoto } from '@/API/user'
export default {
  name: 'UpdatePhoto',
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data () {
    return {
      cropper: null
    }
  },
  components: {

  },
  computed: {},
  watch: {},
  created () { },
  mounted () {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1,  // 
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
  },
  methods: {
    onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })
      try {
        this.cropper.getCroppedCanvas().toBlob(async blob => {
          // 错误的使用方式 详细看文档
          // 如果接口要求 Content-Type 是 application/json 
          // 则传递普通 js 对象
          // this.updateUserPhoto({
          //   photo:blob
          // })

          // 如果接口 要求 Content-type 是  multipart/form-data 则你必须传递 FormData对象
          const formData = new FormData()
          formData.append('photo', blob)
          const { data } = await updateUserPhoto(formData)
          // 关闭弹出层
          this.$emit('close')
          // 更新视图
          this.$emit('update-photo', data.photo)
          this.$toast.success('更新成功')
        })

      } catch (error) {
        this.$toast.success('发生了一些错误')
      }
    }
  }
}
</script>

<style scoped lang="less">
.update-photo {
  background-color: #000;
  height: 100%;
  color: #ffff;
  .img {
    max-width: 100%;
    display: block;
  }
  .toolbar {
    display: flex;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    justify-content: space-between;
    .cancel {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
