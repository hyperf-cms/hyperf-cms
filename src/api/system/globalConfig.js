import request from '@/utils/request'
export function systemGlobalConfigList(params) {
    return request({
        url: '/setting/system/global_config',
        method: 'get',
        params: params
    })
}

export function createGlobalConfig(params) {
    return request({
        url: '/setting/system/global_config',
        method: 'post',
        data: params
    })
}

export function updateGlobalConfig(name, params) {
    return request({
        url: '/setting/system/global_config' + '/' + name,
        method: 'put',
        data: params
    })
}

export function deleteGlobalConfig(name, params) {
    return request({
        url: '/setting/system/global_config' + '/' + name,
        method: 'delete',
        data: params,
    })
}