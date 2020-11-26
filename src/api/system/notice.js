import request from '@/utils/request'

export function getNoticeList(params) {
    return request({
        url:'/setting/system/notice',
        method:'get',
        params:params
    });
}

export function getOneNotice(params) {
    return request({
        url:'/setting/system/notice',
        method:'get',
        params:params
    });
}

export function createNotice(params) {
    return request({
        url:'/setting/system/notice',
        method:'post',
        data:params
    });
}

export function updateNotice(id, params) {
    return request({
        url:'/setting/system/notice' + '/' + id,
        method:'put',
        data:params
    });
}

export function deleteNotice(id) {
    return request({
        url:'/setting/system/notice' + '/' + id,
        method:'delete'
    });
}
