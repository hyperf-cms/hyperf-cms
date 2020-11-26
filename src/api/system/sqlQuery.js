import request from '@/utils/request'
export function getSqlResult(params) {
    return request({
        url:'/setting/technique/get_sql_result',
        method:'get',
        params:params
    });
}

export function exportSql(params) {
    return request({
        url:'/setting/technique/export_sql',
        method:'get',
        params:params
    });
}

export function getSqlFile(params) {
    return request({
        url:'/setting/technique/get_sql_file',
        method:'get',
        params:params
    });
}

export function deleteFileList(params) {
    return request({
        url:'/setting/technique/delete_sql_file',
        method:'post',
        data:params
    });
}
