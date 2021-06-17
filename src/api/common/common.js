import request from '@/utils/request'

export function getSysConfig(params) {
  return request({
    url:'/common/sys_config',
    method:'get',
    params:params
  })
}

export function getExcelContent(params) {
  return request({
    url:'/common/excel_content',
    method:'post',
    data:params
  })
}