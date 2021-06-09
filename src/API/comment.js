// 评论请求模块
import request from '@/util/request'

//  获取文章评论列表
export const getComments = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    params

  })
}



// 对评论或者评论回复点赞
export const addLike = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comment/likings',
    data: {
      target
    }
  })
}






// 取消对评论或者评论回复点赞
export const deleteLike = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/comment/likings/${target}`,
  })
}




// 取消对评论或者评论回复点赞
export const addComment = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comments',
    data
  })
}
