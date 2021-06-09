<template>
  <div class="comment-post">
    <van-field class="post-field" v-model.trim="message" rows="2" autosize type="textarea" maxlength="50" placeholder="请输入留言" show-word-limit />
    <van-button class="post-btn" @click="onAddComment" :disabled="!message.length">发布</van-button>
  </div>
</template>

<script>
import { addComment } from '@/API/comment'
export default {
  name: 'CommentPost',
  components: {},
  props: {
    target: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      message: ''
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    async onAddComment () {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true, //登陆中禁用背景点击 
        duration: 0 //默认持续事件 2000毫秒  如果为0 则持续展示
      })

      try {
        const { data } = await addComment({
          target: this.target,    //评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）	
          content: this.message,   //评论内容
          art_id: null
        })
        console.log(data);
        // 3.清空文本框
        this.message = ''
        this.$emit('post-success', data.data)
        this.$toast.success('发布成功')
      } catch (error) {
        this.$toast('回复失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
