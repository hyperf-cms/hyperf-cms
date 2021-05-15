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

export function groupAlbum(params) {
  return request({
    url: '/laboratory/chat_module/group/group_album',
    method: 'get',
    params: params
  })
}

export function groupInvite(params) {
  return request({
    url: '/laboratory/chat_module/group/group_invite',
    method: 'get',
    params: params
  })
}

export function groupMemberManage(params) {
  return request({
    url: '/laboratory/chat_module/group/group_member_manage',
    method: 'get',
    params: params
  })
}