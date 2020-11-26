import request from '@/utils/request'
export function getOperateLog(params) {
  return request({
    url:'/setting/system/get_operate_log',
    method:'get',
    params:params
  })
}

export function exportOperateLog(params) {
  return request({
    url:'/setting/system/export_operate_log',
    method:'post',
    data: params
  })
}

export function getExportOperateLog(params) {
  return request({
    url:'/setting/system/get_export_operate_log',
    method:'get',
    params:params
  })
}

export function clearExportOperateLog(params) {
  return request({
    url:'/setting/system/clear_export_operate_log',
    method:'post',
    data: params
  })
}
