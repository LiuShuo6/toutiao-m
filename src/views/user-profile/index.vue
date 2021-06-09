<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="个人信息" left-arrow @click-left="$router.back()"> </van-nav-bar>
    <input type="file" hidden ref="file" @change="onFileChange">
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image class="avatar" fit="cover" round :src="user.photo" />
    </van-cell>
    <van-cell title="昵称" :value="user.name" is-link @click="showPopup"></van-cell>
    <van-cell title="性别" :value="user.gender===1 ?'女':'男' " @click="isGennerShowUp" is-link></van-cell>
    <van-cell title="生日" :value="user.birthday" is-link @click="isBirthdayShowUp"> </van-cell>

    <van-popup v-model="show" position="bottom" style="height:100%">
      <update-name v-if="show" @close='show=false' v-model='user.name'></update-name>
    </van-popup>

    <van-popup v-model="isGennerShow" position="bottom">

      <update-genner v-if="isGennerShow" @close='isGennerShow=false' v-model="user.gender"></update-genner>
    </van-popup>

    <van-popup v-model="isBirthdayShow" position="bottom">
      <update-birth v-if="isBirthdayShow" v-model="user.birthday" @close="isBirthdayShow=false"></update-birth>
    </van-popup>

    <van-popup v-model="isPhotoShow" style="height:100%" position="bottom">
      <update-photo v-if="isPhotoShow" @update-photo="user.photo=$event" @close="isPhotoShow=false" :img="img"></update-photo>
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/API/user'
import UpdateName from './components/update-name.vue'
import UpdateGenner from './components/update-genner.vue'
import UpdateBirth from './components/update-birth.vue'
import UpdatePhoto from './components/update-photo.vue'
export default {
  name: 'UserProfile',
  props: {},
  data () {
    return {
      user: {},
      show: false,
      isGennerShow: false,
      isBirthdayShow: false,
      isPhotoShow: false,
      img: null  //预览的图片
    }
  },
  components: {
    UpdateName,
    UpdateGenner,
    UpdateBirth,
    UpdatePhoto

  },
  computed: {},
  watch: {},
  created () {
    this.getUserProfile()
  },
  mounted () {

  },
  methods: {
    async getUserProfile () {
      try {
        const { data } = await getUserProfile()

        console.log(data);
        this.user = data.data
      } catch (error) {

        this.$toast('获取信息失败')
      }
    },
    showPopup () {
      this.show = true;
    },
    isGennerShowUp () {
      this.isGennerShow = true
    },
    isBirthdayShowUp () {
      this.isBirthdayShow = true
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文章对象获取 blob 数据
      const data = window.URL.createObjectURL(file)
      this.img = data
      this.isPhotoShow = true
      // file-input 如果每次选择了同一个文件 不会触发 change 事件
      // 解决办法就是每次使用完毕 把他的value清空
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
