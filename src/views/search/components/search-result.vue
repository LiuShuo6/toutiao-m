<template>
  <div class="search-result">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error.sync="error" error-text="加载失败,请点击重试">
      <van-cell v-for="(item,index) in list" :key="index" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/API/search'
export default {
  name: 'SearchResultIndex',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20,
      error: false,

    };
  },
  methods: {
    async onLoad () {

      try {
        // 1.请求获取数据  
        const { data } = await getSearchResult({
          page: this.page,  //页码
          per_page: this.perPage,//每页大小
          q: this.searchText  //查询关键词
        })
        console.log(data);
        // 2.将数据添加到数组列表中
        // 把results 解构出来 
        const { results } = data.data
        this.list.push(...results)
        // 3.将本次加载中的loading关闭
        this.loading = false
        // 4.判断是否还有数据   
        if (results.length) {
          // 如果有则更新获取下一页的页码
          this.page++
        }
        else {
          // 如果没有则将加载状态  finished 设置为结束
          this.finished = true
        }



      } catch (error) {
        // 展示加载失败的
        this.error = true
        // 加载失败了,loading 也要关闭
        this.loading = false
      }


    },
  },
}
</script>

<style>
</style>