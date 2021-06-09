// 文章请求模块



import request from '@/util/request'


// 请求获取文章列表数据
export const getArticles = (params) => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params
  })
}



// 请求获取文章
export const getArticlesById = articleId => {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${articleId}`,
  })
}




// 收藏文章
export const addCollect = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/collections',
    data: {
      target
    }
  })
}


// 取消收藏文章
export const deleteCollect = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/collections/${target}`,
  })
}



// 对文章点赞
export const addLikeArticle = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/likings',
    data: {
      target
    }
  })
}






// 取消对文章点赞
export const deleteLikeArticle = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/likings/${target}`,
  })
}
