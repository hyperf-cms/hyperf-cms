import request from '@/utils/request'
export function policy(params) {
  return request({
    url:'/common/send_phone_code',
    method:'get',
    params:params
  })
}

export function uploadPic(params) {
  return request({
    url:'/common/upload_pic',
    method:'post',
    data:params
  })
}

export function getExcelContent(params) {
  return request({
    url:'/common/excel_content',
    method:'post',
    data:params
  })
}