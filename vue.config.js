// function mock(app, url, data) {
//   app.get(url, (request, response) => {
//     response.json(data)
//   })
// }
// const mockBookHomeData = require('./src/mock/bookHome')
// const mockBookShelfData = require('./src/mock/bookShelf')
// const mockBookList = require('./src/mock/bookCategoryList')
// const mockBookFlatList = require('./src/mock/bookFlatList')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  //关闭eslint
  lintOnSave: false,
  assetsDir: 'static',
  devServer: {
		host: "0.0.0.0",
		port: 8080, // 端口号
		https: false, // https:{type:Boolean}
		open: true, //配置自动启动浏览器  http://XXX.XXX.X.XX:7071/rest/XXX/ 
		hotOnly: true, // 热更新
  }
}
