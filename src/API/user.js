// 用户相关请求模块
import request from '@/util/request'
import store from '@/store'

export const login = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    Headers: {
      // 'Content-Type': 'application/json'
    },
    data
  })
}


//发送验证码  每手机号每分钟1次

export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })

}





// 获取用户自己的信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: `/app/v1_0/user`,
    // 专门用来发送请求头数据
    // headers: {
    //   // 该接口需要授权 才可以访问
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}




// 获取用户频道列表
export const getUserChannels = () => {
  return request({
    method: "GET",
    url: "/app/v1_0/user/channels",

  })
}


// 关注用户
export const addFollow = target => {
  return request({
    method: 'POST',
    url: "/app/v1_0/user/followings",
    data: {
      target
    }

  })
}




// 取消关注用户
export const deleteFollow = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${target}`,
  })
}



// 获取当亲登录用户信息
export const getUserProfile = target => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/profile',
  })
}




// 修改当亲登录用户信息
export const editUserProfile = data => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data
  })
}




// 修改当亲登录用户头像
export const updateUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    data
  })
}