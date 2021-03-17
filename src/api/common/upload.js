import request from '@/utils/request'
export function uploadPic(params) {
  return request({
    url: '/common/upload/single_pic',
    method:'post',
    data:params
  })
}

export function uploadPicByBase64(params) {
  return request({
    url: '/common/upload/single_pic_by_base64',
    method:'post',
    data:params
  })
}