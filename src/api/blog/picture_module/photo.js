import request from '@/utils/request'
export function photoList(params) {
  return request({
    url: '/blog/picture_module/photo/list',
    method: 'get',
    params: params
  })
}

export function createPhoto(params) {
  return request({
    url: '/blog/picture_module/photo/store',
    method: 'post',
    data: params
  })
}

export function deletePhoto(id) {
  return request({
    url: '/blog/picture_module/photo/destroy' + '/' + id,
    method: 'delete',
    data: id,
  })
}