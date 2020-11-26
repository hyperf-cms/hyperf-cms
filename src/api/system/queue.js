import request from '@/utils/request'

export function getQueueList(params) {
  return request({
    url: '/setting/technique/queue_list',
    method: 'get',
    params: params
  })
}