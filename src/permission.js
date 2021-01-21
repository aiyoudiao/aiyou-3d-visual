import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import {
  setTitle,
  getPageTitle
} from '@/utils/util' // 设置浏览器头部标题

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  // 设置浏览器头部标题
  const browserHeaderTitle = getPageTitle(to.name)
  store.commit('user/SET_BROWSERHEADERTITLE', {
    browserHeaderTitle: browserHeaderTitle
  })

  next()

  NProgress.done()
})

/**
 * 在路由跳转结束，设置文档的title
 */

router.afterEach(() => {
  NProgress.done() // 结束Progress
  setTimeout(() => {
    const browserHeaderTitle = store.getters.browserHeaderTitle
    console.log('browserHeaderTitle', browserHeaderTitle)
    setTitle(browserHeaderTitle)
  }, 0)
})
