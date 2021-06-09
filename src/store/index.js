import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem, removeItem } from '../util/storage'

Vue.use(Vuex)


const TOKEN_KEY = 'TOUTIAO_USER'
export default new Vuex.Store({
  state: {
    // 一个对象, 用于存储当前用户登录信息 (token 等数据)
    user: getItem(TOKEN_KEY)
    // user: window.localStorage.getItem(TOKEN_KEY)
  },
  mutations: {
    setUser (state, data) {
      state.user = data

      // 为了防止刷新后 丢失 需要把数据备份到本地存储中   直接写state.user 会把这个对象变成字符串 [objcet][object] 
      // 所以需要JSON.stringify 将对象转换为 JSON格式的字符串 放到本地存储
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
