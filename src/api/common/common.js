import request from '@/utils/request'

export function getExcelContent(params) {
  return request({
    url:'/common/excel_content',
    method:'post',
    data:params
  })
}