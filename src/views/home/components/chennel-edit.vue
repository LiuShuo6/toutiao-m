<template>
  <div class="chennel-edit">

    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button type="danger" plain round size="small" class="editbtn" @click="isEdit=!isEdit">{{isEdit ? '完成':'编辑'}}</van-button>
    </van-cell>
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item class="grid-item" v-for="(item,index) in channels" :key="index" @click="onMyChannelClick(item,index)">
        <van-icon slot="icon" name="clear" v-show="isEdit && !flexdChannels.includes(item.id)"></van-icon>

        <!-- v-bind class 语法 
         一个对象,对象中的 key表示 要作用的css 类名 
         对象中的value 要计算出布尔值
         如果 布尔值为true，则作用该类名
         如果是false 则不作用这个类名
         -->
        <span class="text" :class="{active:index===active}" slot="text">{{item.name}}</span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐  -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10" class="recommend-grid">
      <van-grid-item class="grid-item" v-for="(channal,index) in recommendChannels" :key="index" :text="channal.name" icon='plus' @click="onAddChannel(channal)" />
    </van-grid>
    <!-- /频道推荐  -->
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/API/channel'
import { mapState } from 'vuex'
import { setItem } from '@/util/storage'
export default {
  name: 'ChennelEdit',
  props: {
    channels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false,//控制编辑状态的显示
      flexdChannels: [0]//固定频道不允许删除
    }
  },
  created () {
    this.loadAllChannels()
  },
  computed: {
    recommendChannels () {
      return this.allChannels.filter(channel => {
        return !this.channels.find(myChannel => {
          return myChannel.id === channel.id
        })
      })
      // 把计算结果返回出去
      // return channels
    },
    ...mapState(['user'])
  },
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (error) {
        this.$toast('数据获取失败')
      }
    },

    async onAddChannel (channal) {
      // 数据持久化处理
      try {
        this.channels.push(channal)
        if (this.user) {
          // 已登录,存储到线上
          await addUserChannel([{
            id: channal.id,//频道id
            seq: this.channels.length//序号
          }]);

          // console.log(data);
        } else {
          // 未登录 把数据存储到本地
          setItem('TOUTIAO_CHANNELS', this.channels)
        }
      } catch (error) {
        this.$toast('保存失败,请稍后重试')
      }
    },

    onMyChannelClick (item, index) {
      //如果是编辑状态 则执行删除频道 否则 执行 切换频道
      if (this.isEdit) {
        // 如果是固定频道 则不删除
        if (this.flexdChannels.includes(item.id)) {
          return
        }

        //编辑状态，执行删除频道
        // splice():
        //参数1：要删除的元素的索引(包括)
        //参数2：删除的个数 如果不指定 则 从参数1开始一直删除到最后
        if (index <= this.active) {
          // 让激活频道的索引 -1
          this.$emit('update-active', this.active - 1, true)
        }
        this.channels.splice(index, 1)
        // 处理持久化
        this.deleteChannel(item)

      }

      else {
        //非编辑状态 切换频道
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel (item) {
      try {
        if (this.user) {
          // 已登录,则将数据更新到线上
          await deleteUserChannel(item.id)

        } else {
          // 未登录,将数据更新到本地
          setItem('TOUTIAO_CHANNELS', this.channels)
        }

      } catch (error) {
        this.$toast('操作失败,请稍后重试')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.chennel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }
  .editbtn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }

      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        white-space: nowrap;
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
        .van-grid-item__text {
          margin-top: 0;
        }
      }
    }
  }
}
</style>