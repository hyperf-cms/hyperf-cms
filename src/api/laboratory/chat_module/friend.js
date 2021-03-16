import request from '@/utils/request'
export function historyMessage(params) {
  return request({
    url: '/laboratory/chat_module/friend/history_message',
    method: 'get',
    params: params
  })
}