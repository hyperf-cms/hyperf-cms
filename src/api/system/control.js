import request from '@/utils/request'
export function getControlList(params) {
	return request({
		url: '/setting/system/get_control_list',
		method: 'get',
		params: params
	})
}

export function changeControl(params) {
	return request({
		url: '/setting/system/change_control',
		method: 'post',
		data: params
	})
}

export function clearExcel(params) {
	return request({
		url: '/setting/system/clear_excel',
		method: 'post',
		data: params
	})
}

export function clearSql(params) {
	return request({
		url: '/setting/system/clear_sql',
		method: 'post',
		data: params
	})
}

export function backupLog(params) {
	return request({
		url: '/setting/system/backup_log',
		method: 'post',
		data: params
	})
}

export function clearLog(params) {
	return request({
		url: '/setting/system/clear_log',
		method: 'post',
		data: params
	})
}

export function getBackupLog(params) {
	return request({
		url: '/setting/system/get_backup_log',
		method: 'get',
		params: params
	})
}

export function clearBackupLog(params) {
	return request({
		url: '/setting/system/clear_backup_log',
		method: 'post',
		data: params
	})
}
