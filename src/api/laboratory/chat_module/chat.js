import request from '@/utils/request'
export function pullMessage(params) {
  return request({
    url: '/laboratory/chat_module/pull_message',
    method: 'get',
    params: params
  })
}