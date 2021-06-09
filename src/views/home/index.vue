<template>
  <keep-alive>
    <div class="home-container">
      <!-- 导航栏 -->
      <van-nav-bar class="page-nav-bar" fixed>
        <van-button class="search-btn" slot="title" type="info" size="small" round icon="search" to="/search">搜索</van-button>
      </van-nav-bar>
      <!-- /导航栏 -->

      <!-- 频道列表 -->
      <!-- 通过 animated 属性可以开启切换标签内容时的转场动画。 -->
      <!-- 通过 swipeable 属性可以开启滑动切换标签页 -->
      <van-tabs class="channal" v-model="active" animated swipeable>
        <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
          <!-- 文章列表 -->
          <article-list :channel="channel"></article-list>

        </van-tab>
        <div slot="nav-right" class="placeholder"></div>
        <div slot="nav-right" class="hamburge-btn">
          <i class="toutiao toutiao-gengduo" @click="isChennelEditShow=true"> </i>
        </div>
        <!-- /频道列表 -->
      </van-tabs>
      <!-- 频道编辑弹出层 -->
      <van-popup v-model="isChennelEditShow" closeable position="bottom" :style="{ height: '100%' }" close-icon-position="top-left">

        <chennel-edit :channels="channels" :active="active" @update-active="onUpdateActive"></chennel-edit>
      </van-popup>
    </div>
  </keep-alive>
</template>
<script>
import { getUserChannels } from '@/API/user.js'
import ArticleList from './components/article-list'
import ChennelEdit from './components/chennel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/util/storage'
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0,
      channels: [],//频道列表
      isChennelEditShow: false // 控制频道编辑弹出层是否显示
    }
  },
  components: {
    ArticleList,
    ChennelEdit
  },
  created () {
    this.loadingChannels()
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async loadingChannels () {
      try {
        // const { data } = await getUserChannels()
        // this.channels = data.data.channels
        let channels = []
        if (this.user) {
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          const localChannels = getItem('TOUTIAO_CHANNELS')
          if (localChannels) {
            channels = localChannels
          } else {
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }


        this.channels = channels


      } catch (error) {
        this.$toast('获取频道数据失败')
      }
    },
    onUpdateActive (index, isChennelEditShow = true) {
      this.active = index
      this.isChennelEditShow = isChennelEditShow
    }

  }

}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }

  /deep/ .channal {
    .van-tabs__wrap {
      height: 82px;
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777;
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__nav {
      padding-bottom: unset;
    }
    .van-tabs__line {
      width: 31px;
      height: 6px;
      background-color: #3296fa;
      bottom: 8px;
    }
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
    .hamburge-btn {
      position: fixed;
      right: 0;
      width: 66px;
      height: 82px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      opacity: 0.902;
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: "";
        width: 1px;
        height: 100%;
        background: url(~@/assets/gradient-gray-line.png);
        position: absolute;
        left: 0;
        background-size: contain;
      }
    }
  }
}
</style>
