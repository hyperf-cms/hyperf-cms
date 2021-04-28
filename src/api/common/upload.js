import request from '@/utils/request'
export function uploadPic(params) {
  return request({
    url: '/common/upload/single_pic',
    method:'post',
    data:params
  })
}

export function uploadPicByBlob(params) {
  return request({
    url: '/common/upload/single_pic_by_blob',
    method:'post',
    data:params
  })
}