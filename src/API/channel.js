//频道请求模块
import request from '@/util/request'

// 请求全部频道列表
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}


// 添加用户频道
export const addUserChannel = channels => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data: {
      channels: channels
    }
  })
}


// 删除用户指定频道
export const deleteUserChannel = (id) => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${id}`,
  })
}