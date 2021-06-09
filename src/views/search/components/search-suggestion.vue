<template>
  <div class="search-suggestion">
    <van-cell v-for="(item, index) in Suggestions" :key="index" icon="search" @click="$emit('search',item)">
      <div slot="title" v-html="highlight(item)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/API/search'
// 按需加载，有好处,只会把使用到的成员打包到结果中
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestionIndex',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      Suggestions: []  //联想建议数据列表
    }
  },
  watch: {
    searchText: {
      // 当 searchText 发生改变的时候 会调用这个 handler 函数
      // 注意：handler 函数名称 是固定的 

      // debounce 函数
      // 参数1：一个函数 
      // 参数2，延迟的时间  单位是毫秒
      // 返回值：防抖之后的函数
      handler: debounce(function (val) {
        this.loadSearchSuggestions(val)
      }, 200),


      // handler (val) {
      //   this.loadSearchSuggestions(val)
      // },
      immediate: true  // 该回调将会在侦听开始之后被立即调用
    }
  },
  methods: {
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions(q)
        this.Suggestions = data.data.options

      } catch (error) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },
    highlight (item) {
      const highlightStr = `<span class="active">${this.searchText}</span>`
      // 正则表达式 //中间的内容都会当作匹配字符串来使用,而不是数据变量
      //如果需要根据数据变量动态的创建正则表达式,则手动 new RegExp
      // 参数1：匹配模式字符串，它会根据这个字符串创建正则对象
      // 参数2：匹配模式， 要写到字符串中
      const reg = new RegExp(this.searchText, 'gi')
      // 把item 字符串中的 reg字符串 替换为高亮后的
      // replace 不会替换原字符串
      return item.replace(reg, highlightStr)
    }
  }
}
</script>

<style lang="less" scoped>
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>