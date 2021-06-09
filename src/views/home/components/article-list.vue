<template>
  <div class="article-list">
    <van-pull-refresh v-model="isreFreshLoading" @refresh="onRefresh" :success-text="refreshSuccessText" success-duration="1000">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error.sync="error" error-text="请求失败，点击重新加载">
        <!-- <van-cell v-for="(article,index) in list" :key="index" :title="article.title" /> -->
        <article-item v-for="(article,index) in list" :key="index" :article="article "></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/API/article'
import ArticleItem from '@/components/article'
export default {
  name: 'ArticleList',
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [],  //存储列表数据的数据
      loading: false,//控制加载中 loading状态
      finished: false,//控制数据加载结束的状态
      timestamp: null, //请求获取下一页的时间戳
      error: false, // 控制列表加载失败的提示状态
      isreFreshLoading: false, //控制下拉刷新的 loading 状态
      refreshSuccessText: '刷新成功'//下拉刷新成功提示文本
    }
  },
  components: {
    ArticleItem
  },
  methods: {
    async onLoad () {
      try {

        const { data } = await getArticles({
          channel_id: this.channel.id,//频道id
          // 简单理解就是请求数据的页码 请求第一页数据:当前最新时间戳
          // 用于请求之后数据的时间戳会在当前请求结果中 返回给你
          timestamp: this.timestamp || Date.now(),
          with_top: 1 //是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        const { results } = data.data
        // 数组的展开操作符  它会把数组元素 一个一个拿出来
        this.list.push(...results)
        this.loading = false
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        }
        else {
          // 没有数据了 将finshed 设置为true 不在load 加载更多了
          this.finished = true
        }
      } catch (error) {
        this.error = true;
        //  请求失败 loading 也需要关闭
        this.loading = false

      }
    },

    // 当下刷新的时候会触发调用该函数
    async onRefresh () {

      try {
        //请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id,//频道id
          // 简单理解就是请求数据的页码 请求第一页数据:当前最新时间戳
          // 用于请求之后数据的时间戳会在当前请求结果中 返回给你
          timestamp: Date.now(),//下拉刷新 每次请求获取最新数据，所以传递当前最新时间戳
          with_top: 1 //是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        const { results } = data.data
        //将数据追加到列表顶部
        this.list.unshift(...results)
        //  关闭下拉刷新的状态
        this.isreFreshLoading = false

        // 更新下拉刷新成功提示的文本
        this.refreshSuccessText = `刷新成功,更新了${results.length}条数据`
      } catch (error) {
        this.isreFreshLoading = false
        this.refreshSuccessText = `刷新失败,请重试`
      }


    }
  },
};


</script>

<style>
</style>