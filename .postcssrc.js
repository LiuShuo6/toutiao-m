
/**
 PostCSS配置文件
 **/


module.exports = {
  // 配置要使用的 PostCSS 插件
  plugins: {

    // 配置使用  autoprefixer 插件
    // 作用,生成浏览器 CSS样式规则前缀
    // VueCli 内部已经配置了 autoprefixe这个插件  
    // 这里又配置一次,所以产生冲突
    // 'autoprefixer': { //autoprefixe 插件的配置
    //   // 配置要兼容到的环境信息
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    // 配置使用 postcss-pxtorem 插件
    // 作用 把px 转为 rem
    'postcss-pxtorem': {
      //  lib-flexble 的 REM 适配方案,把一行 分为 10份 每一份就是 十分之一
      // 所以 rootValue 应该设置为 你的设计稿的 宽的的十分之一
      // 我们的设计稿是 750 ,所以应该设置 750 / 10 = 75
      // 但是 vant 建议 设置为 37.5 因为 vant 是基于 375 写的
      // 所以必须设置为37.5  唯一的缺点就是 使用 设计稿的尺寸  都必须 / 2
      // 如果是 vant 的样式 就按照 37.5 来转换,如果是我们自己的样式 就按照 75转换 
      // 通过查阅文档,发现 rootValue 支持两种类型 一种是数字,另一种是函数
      // 函数可以动态处理返回
      //   postcss-pxtorem 进行处理每个css 文件的时候都会 来调用这个函数
      // 它会把被处理的 css 文件 相关的信息 通过参数 传递给该函数
      // rootValue: 37.5,
      rootValue (obj) {
        // console.log(obj);
        var file = obj.file
        // console.log('处理的css文件：' + file);
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },

      // 配置要转换的 CSS 属性 * 表示所有
      propList: ['*'],

      // 配置不要转换的样式资源
      exclude: 'github-markdown'
    }
  }
}