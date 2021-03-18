import request from '@/utils/request'
export function uploadPicByBase64(params) {
  return request({
    url: '/laboratory/chat_module/upload_pic_by_base64',
    method:'post',
    data:params
  })
}

export function uploadFile(params) {
  return request({
    url: '/laboratory/chat_module/upload_file',
    method:'post',
    data:params
  })
}