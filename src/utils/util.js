/**
 * 动态插入css
 */


export const loadStyle = url => {
  const link = document.createElement('link')
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = url
  const head = document.getElementsByTagName('head')[0]
  head.appendChild(link)
}

/**
 * 设置浏览器头部标题
 */


export const setTitle = function (title) {
  title = title ? `${title}` : 'aiyou-3d-visual'
  window.document.title = title + '-aiyou-3d-visual'
}


/**
 *  生成浏览器头部的标题
 */


export const getPageTitle = function (pageTitle) {
  const title = document.title
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }

  return `${title}`
}
