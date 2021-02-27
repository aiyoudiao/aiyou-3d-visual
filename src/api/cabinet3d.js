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

export function getCabinetAndDevice(id) {
  const data = {
    id
  }
  return request({
    url: '/cabinet3d/getCabinetAndDevice',
    method: 'post',
    data: data
  })
}

export function subCabinetRecordDevice(params) {
  const data = {
    ...params
  }
  return request({
    url: '/cabinet3d/subCabinetRecordDevice',
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
