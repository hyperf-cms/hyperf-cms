import request from '@/utils/request'

export function getDirList(params) {
  return request({
    url:'/setting/technique/get_dir_list',
    method:'get',
    params:params
  });
}

export function getFileList(params) {
  return request({
    url: '/setting/technique/get_file_list',
    method: 'get',
    params: params
  });
}

export function deleteFile(params) {
  return request({
    url: '/setting/technique/delete_file',
    method: 'post',
    data: params
  });
}
