import request from '@/utils/request'

export function getList(input, pageSize, pageNumber, type) {
  const data = {
    input, pageSize, pageNumber, type
  }
  return request({
    url: '/cabinet3d/getTableList',
    method: 'post',
    data: data
  })
}

export function removeItem(id) {
  return request({
    url: '/cabinet3d/remove/' + id,
    method: 'delete'
  })
}
