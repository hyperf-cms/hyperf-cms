import request from "@/utils/request";
export function noticeList(params) {
  return request({
    url: "/setting/system_module/notice/list",
    method: "get",
    params: params
  });
}

export function createNotice(params) {
  return request({
    url: "/setting/system_module/notice/store",
    method: "post",
    data: params
  });
}

export function editNotice(id) {
  return request({
    url: "/setting/system_module/notice/edit/" + id,
    method: "get",
    params: ""
  });
}

export function updateNotice(id, params) {
  return request({
    url: "/setting/system_module/notice/update" + "/" + id,
    method: "put",
    data: params
  });
}

export function deleteNotice(id, data) {
  return request({
    url: "/setting/system_module/notice/destroy" + "/" + id,
    method: "delete",
    data: data
  });
}
