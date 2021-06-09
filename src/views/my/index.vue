<template>
  <div class="my-container">

    <div v-if='user' class="header user-info">
      <div class="base-info">
        <div class="left">
          <van-image class="avatar" round fit='cover' :src="userInfo.photo" />
          <span class="name">{{userInfo.name}}</span>

        </div>
        <div class="right">
          <van-button size='mini' round to="/user/profile"> 编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <div class="count">{{userInfo.art_count}}</div>
          <div class="text">头条</div>
        </div>
        <div class="data-item">
          <div class="count">{{userInfo.follow_count}}</div>
          <div class="text">关注</div>
        </div>
        <div class="data-item">
          <div class="count">{{userInfo.fans_count}}</div>
          <div class="text">粉丝</div>
        </div>
        <div class="data-item">
          <div class="count">{{userInfo.like_count}}</div>
          <div class="text">获赞</div>
        </div>
      </div>
    </div>

    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img src="~@/assets/mobile.png" class="mobile-img" alt="">
        <span class="text"> 登录/注册</span>
      </div>
    </div>

    <!-- 导航 -->
    <van-grid class="grid-nav" :column-num="2" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>

    <van-cell title="消息通知" is-link></van-cell>
    <van-cell class="mb-9" title="小智同学" is-link></van-cell>
    <van-cell v-if="user" center class="logout-cell" title="退出登录" clickable @click="onLayout"></van-cell>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/API/user'
export default {
  name: 'MyIndex',
  data () {
    return {
      userInfo: {} //用户信息
    }
  },
  created () {
    //如果用户登录了,则请求加载用户信息
    if (this.user) {
      this.loadUserInfo()
    }

  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    onLayout () {
      //  退出提示
      // 在组件中需要使用 this.$dialog 来调用 弹框组件
      this.$dialog.confirm({
        title: '确认提出吗',

      })
        .then(() => {
          // on confirm
          // 确认退出，清楚登陆状态 (容器中的user 和本地存储中的 user)
          this.$store.commit('setUser', null)

        })
        .catch(() => {
          // on cancel
          console.log('取消执行这里');
        })


    },
    async loadUserInfo () {
      try {
        const { data } = await getUserInfo()
        console.log(data);
        this.userInfo = data.data
      } catch (error) {
        this.$toast('获取数据失败,请稍后重试')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.my-container {
  .header {
    height: 361px;
    background: url("~@/assets/banner.png");
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      flex-direction: column;
      display: flex;
      justify-content: center;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
      }
      .text {
        font-size: 28px;
        color: #fff;
        margin: 15px 0;
      }
    }
  }
  .user-info {
    .base-info {
      box-sizing: border-box;
      height: 231px;
      padding: 76px 32px 23px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .name {
          font-size: 30px;
          color: #fff;
        }

        .avatar {
          width: 132px;
          height: 132px;
          margin-right: 23px;
          border: 1px solid #fff;
        }
      }
    }
    .data-stats {
      display: flex;
      // height: 130px;
      .data-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 130px;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }

  .grid-nav {
    .grid-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }
  .logout-cell {
    text-align: center;
    color: #d86262;
  }

  .mb-9 {
    margin-bottom: 9px;
  }
}
</style>