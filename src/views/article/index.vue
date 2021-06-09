<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" left-arrow title="头条" @click-left="onClickLeft"></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail  markdown-body" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{article.title}}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image class="avatar" slot="icon" round fit="cover" :src="article.aut_photo" />
          <div slot="title" class="user-name">{{article.aut_name}}</div>
          <div slot="label" class="publish-date">{{article.pubdate|relativeTime}}</div>
          <!-- <van-button v-if="article.is_followed" class="follow-btn" round size="small" @click="onFollow" :loading="followLoading">已关注</van-button>
          <van-button v-else class="follow-btn" type="info" color="#3296fa" round size="small" icon="plus" @click="onFollow" :loading="followLoading">关注</van-button> -->

          <!-- 模板中的 $event 是时间参数 -->
          <follow-user class="follow-btn" :is-followed="article.is_followed" :user-id="article.aut_id" @update-is_followed="article.is_followed=$event" />

        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div class="article-content" v-html="article.content" ref="article-content"></div>
        <van-divider>正文结束</van-divider>
        <!-- 文章的评论列表 -->
        <comment-list :list="commentList" :source="article.art_id" @onload-success="onloadSuccess" />
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn" type="default" round size="small" @click="isPostCommentShow =true">写评论</van-button>
          <van-icon name="comment-o" :badge="totalCommetnCount" color="#777" />
          <!-- <van-icon color="#777" name="star-o" /> -->
          <collect-article v-model="article.is_collected " :article-id="article.art_id" />
          <!-- <van-icon color="#777" name="good-job-o" /> -->
          <like-article v-model="article.attitude" :article-id="article.art_id" />
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 发布评论弹出层 -->
        <van-popup v-model="isPostCommentShow" position="bottom">
          <comment-post :target="article.art_id" @post-success="onPostSuccess" />
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus===404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
  </div>
</template>

<script>
import { getArticlesById } from '@/API/article'
import { ImagePreview } from 'vant';

import FollowUser from '../../components/followuser/follow-user.vue';
import CollectArticle from '../../components/collect-article';
import LikeArticle from '../../components/like-article'
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post.vue';
export default {
  name: 'ArticleIndex',
  components: { FollowUser, CollectArticle, LikeArticle, CommentList, CommentPost, },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      article: {},//文章详情
      loading: true,//加载中的 loading状态
      errStatus: 0,// 失败的状态码
      followLoading: false,
      totalCommetnCount: 0,
      isPostCommentShow: false,//控制发布评论显示状态
      commentList: [] //评论列表
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () { },
  methods: {

    onClickLeft () {
      this.$router.back()
    },
    async loadArticle () {
      this.loading = true
      try {
        const { data } = await getArticlesById(this.articleId)
        // if (Math.random() > 0.5) {
        //   JSON.parse('dfdsfdsfdfd')
        // }
        console.log(data);
        this.article = data.data


        // 初始化图片点击预览
        setTimeout(() => {
          this.previewImage()
        }, 0);
        // 请求成功 关闭loading
        this.loading = false
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.errStatus = 404
        }
        this.loading = false
      }
    },
    previewImage () {
      // 得到所有的 img 节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      const imgUrl = []
      imgs.forEach((v, index) => {
        imgUrl.push(v.src)
        v.onclick = () => {
          ImagePreview({
            images: imgUrl,
            startPosition: index,
          });
        }
      });
      console.log(imgUrl);
    },
    onloadSuccess (data) {
      this.totalCommetnCount = data.total_count
    },
    onPostSuccess (data) {
      // 1 关闭弹出层
      this.isPostCommentShow = false
      // 2.将发布的新内容显示到头部
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>


