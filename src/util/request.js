// 请求模块
import axios from 'axios'
import store from '@/store'
import JSONBIg from 'json-bigint'

// const jsonStr = '{"art_id":1245953273786007552}'
// JSONBIg.parse()   把json 格式的字符串 转换为 js对象
// JSONBIg.stringify()  把js 对象 转为 json 格式的字符串
// JSONBIg 可以处理数据中超出 js 安全整数 范围 的问题
// 使用的时候 要把 BigNumber 类型的数据 转为字符串来使用
// console.log(JSONBIg.parse(jsonStr).art_id.toString());

const request = axios.create({
  // baseURL: 接口的基准路径
  baseURL: 'http://ttapi.research.itcast.cn/',

  // 自定义后端返回的原始数据
  // data:后端返回的原始数据，说白了就是 JSON 格式的字符串
  transformResponse: [function (data) {
    // Do whatever you want to transform the data
    try {
      return JSONBIg.parse(data)
    } catch (error) {
      return data
    }
  }]
  // axios 默认会在内部这样来处理后端返回的数据
  // retrun JSON.parse(data)
})


//  请求拦截器
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  // 请求发起会经过这里
  // config 对象 是本次请求的 请求配置对象 包括请求地址,请求方式,请求头
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 这里务必要返回 config 配置对象,否则请求在这里就停在这里，出不去了
  return config;
}, function (error) {
  // Do something with request error
  // 如果请求出错了,还没有发出去，会进入这里
  return Promise.reject(error);
});



// 响应拦截器



export default request