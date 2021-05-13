import request from '@/utils/request'
export function groupHistoryMessage(params) {
  return request({
    url: '/laboratory/chat_module/group/history_message',
    method: 'get',
    params: params
  })
}

export function groupFile(params) {
  return request({
    url: '/laboratory/chat_module/group/group_file',
    method: 'get',
    params: params
  })
}