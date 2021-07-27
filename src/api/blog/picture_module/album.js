import request from "@/utils/request";
export function albumList(params) {
  return request({
    url: "/blog/picture_module/album/list",
    method: "get",
    params: params
  });
}

export function getAlbumOption(params) {
  return request({
    url: "/blog/picture_module/album/album_option",
    method: "get",
    params: params
  });
}

export function createAlbum(params) {
  return request({
    url: "/blog/picture_module/album/store",
    method: "post",
    data: params
  });
}

export function editAlbum(id) {
  return request({
    url: "/blog/picture_module/album/edit/" + id,
    method: "get",
    params: ""
  });
}

export function updateAlbum(id, params) {
  return request({
    url: "/blog/picture_module/album/update" + "/" + id,
    method: "put",
    data: params
  });
}

export function deleteAlbum(id, data) {
  return request({
    url: "/blog/picture_module/album/destroy" + "/" + id,
    method: "delete",
    data: data
  });
}
