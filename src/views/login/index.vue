<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" class="page-nav-bar">

      <van-icon slot="left" name='cross' size="18" @click="$router.back()" />

    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 登录表单 -->
    <!-- 表单验证：

给 vant-filed 组件配置 rules 验证规则 当表单提交的时候,会自动触发  如果验证通过 会触发 submit 事件



 -->

    <van-form @submit="onSubmit" ref="loginForm">
      <van-field v-model="user.mobile" name="mobile" type="number" maxlength='11' placeholder="请输入手机号" :rules="userFormRules.mobile"><i slot="left-icon" class="toutiao toutiao-shouji"></i></van-field>
      <van-field v-model="user.code" name="code" label="" placeholder="请输入验证码" :rules="userFormRules.code"><i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <!-- time 倒计时时间 -->
          <van-count-down :time="time=1000 * 60 " format="ss s" v-if="isCountDownShow" @finish='isCountDownShow = false' />
          <van-button v-else size="small" round type="default" native-type="button" class="send-sms-btn" @click="onSendSms">发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button block type="info" native-type="submit" class="login-btn">登录</van-button>
      </div>
    </van-form>
    <!-- /登录表单 -->

  </div>
</template>

<script>
import { login, sendSms } from '@/API/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '13911111111',//手机号
        code: '246810' //验证码
      },
      userFormRules: {
        mobile:
          [{
            required: true, message: '手机号不能为空'
          },
          {
            pattern: /1[3|5|7|8]\d{9}$/,
            message: '手机号格式错误'
          }
          ],
        code: [
          { required: true, message: '验证码不能为空 ' },
          {
            pattern: /\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      isCountDownShow: false //是否展示倒计时
    };
  },
  methods: {
    async onSubmit () {
      // 1.获取表单数据
      const user = this.user
      // 2.表单验证



      // 在组件中必须通过 this.$toast 来调用 Toast 组件
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true, //登陆中禁用背景点击 
        duration: 0 //默认持续事件 2000毫秒  如果为0 则持续展示
      })

      // 3.提交表单,请求登录
      try {
        const { data } = await login(user)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登陆成功')
        // 登陆成功跳转会原来页面
        // back 不严谨
        this.$router.back()
      } catch (error) {
        if (error.response.status == 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败,请稍后重试')

        }

      }

      // 4.根据请求响应结果处理后续操作
    },

    async onSendSms () {
      // 1.校验手机号
      try {
        await this.$refs.loginForm.validate('mobile')
        console.log('验证通过');
      } catch (error) {
        return console.log('验证失败', error);
      }

      // 2.验证通过,显示倒计时
      this.isCountDownShow = true

      // 3.请求发送验证码
      try {
        const res = await sendSms(this.user.mobile) //请求验证码
        this.$toast('发送成功')

      } catch (error) {
        // 发送失败关闭倒计时
        this.isCountDownShow = false
        if (error.response.status === 429) {
          this.$toast('发送太频繁了,请稍后重试')
        }
        console.log('发送失败,请稍后重试', error);
      }

    }
  },
}
</script>

<style lang="less" scoped>
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    background-color: #ededed;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
    }
  }
}
</style>>
