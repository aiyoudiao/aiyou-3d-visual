import Mock from 'mockjs'
import tableAPI from './table'
// import loginAPI from './login'
import articleAPI from './article'

import cabinet3dAPI from './cabinet3d'
// 设置全局延时 没有延时的话有时候会检测不到数据变化 建议保留
Mock.setup({
  timeout: '300-600'
})

// 机房可视化相关
Mock.mock(/\/cabinet3d\/getTableList/, 'post', cabinet3dAPI.getTableList)
Mock.mock(/\/cabinet3d\/getCabinetAndDevice/, 'post', cabinet3dAPI.getCabinetAndDevice)
Mock.mock(/\/cabinet3d\/subCabinetRecordDevice/, 'post', cabinet3dAPI.subCabinetRecordDevice)
// Mock.mock(/\/user\/logout/, 'post', loginAPI.logout)
// Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// // 登录相关
// Mock.mock(/\/user\/login/, 'post', loginAPI.loginByUsername)
// Mock.mock(/\/user\/logout/, 'post', loginAPI.logout)
// Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// // 文章相关
// Mock.mock(/\/article\/list/, 'get', articleAPI.getList)
// Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle)
// Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv)
// Mock.mock(/\/article\/create/, 'post', articleAPI.createArticle)
// Mock.mock(/\/article\/update/, 'post', articleAPI.updateArticle)

// // 用户相关
// Mock.mock(/\/user\/listpage/, 'get', tableAPI.getUserList)
// Mock.mock(/\/user\/remove/, 'get', tableAPI.deleteUser)
// Mock.mock(/\/user\/batchremove/, 'get', tableAPI.batchremove)
// Mock.mock(/\/user\/add/, 'get', tableAPI.createUser)
// Mock.mock(/\/user\/edit/, 'get', tableAPI.updateUser)
export default Mock
