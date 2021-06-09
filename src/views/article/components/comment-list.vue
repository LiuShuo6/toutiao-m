<template>
  <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
    <comment-item v-for="(item,index) in list" :key="index" :error="error" :comment="item" error-text="加载失败,请点击重试" />
  </van-list>
</template>

<script>
import { getComments } from '@/API/comment'
import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, //用来获取下一页的标记
      limit: 10,
      error: false
    }
  },
  components: {
    CommentItem
  },
  computed: {},
  watch: {},
  created () {
    this.onLoad()
  },
  mounted () { },
  methods: {
    async onLoad () {
      try {
        // 1.请求获取数据
        // 2.将数据添加到列表中
        // 3.将loading 关闭
        // 4.判断是否还有数据,有就更新获取下一页的数据据页码
        // 没有就将finished 设置结束
        const { data } = await getComments({
          type: 'a',    //评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source,  //源id，文章id或评论id
          offset: this.offset,  //获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit   //获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        console.log(data);
        const { results } = data.data
        this.list.push(...results)

        // 把文章的总数量传递到外部,
        this.$emit('onload-success', data.data)
        this.loading = false
        if (results.length) {
          this.offset = data.data.last_id
        }
        else {
          this.finished = true
        }
      } catch (error) {
        this.error = true
        this.loading = false
      }



    },
  },
}

</script>

<style scoped lang="less">
</style>
