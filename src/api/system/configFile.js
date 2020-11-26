import request from '@/utils/request'

export function getConfigFile(params) {
  return request({
    url:'/setting/technique/get_config_file',
    method:'get',
    params:params
  });
}

export function deleteConfigFile(params) {
  return request({
    url:'/setting/technique/delete_config_file',
    method:'post',
    data: params
  });
}
