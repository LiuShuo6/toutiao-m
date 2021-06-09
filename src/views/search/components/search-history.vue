<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <template v-if="isDeleteShow"> <span @click=" searchhistories = []">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow=false">完成</span>
      </template>
      <van-icon v-else name="delete" @click="isDeleteShow = true"></van-icon>
    </van-cell>
    <van-cell v-for="(item,index) in searchhistories" :key="index" :title="item" @click="onHistoryClick(item,index)">
      <van-icon name="close" v-show="isDeleteShow" @click="searchhistories.splice(index, 1)" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'searchhistoryIndex',
  props: {
    searchhistory: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      // 1、在 data 中添加一个数据用来控制删除相关元素的显示状态
      isDeleteShow: false,
      searchhistories: this.searchhistory


    }
  },
  methods: {
    onHistoryClick (item, index) {
      // 如果是删除状态，则执行删除操作
      if (this.isDeleteShow) {
        this.searchhistories.splice(index, 1)
      }
      else {
        this.$emit('onSearch', item)
      }
    },
  },
}
</script>

<style>
</style>