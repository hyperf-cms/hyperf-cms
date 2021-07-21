import request from "@/utils/request";

export function getExcelContent(data) {
  return request({
    url: "/excel/excel_content",
    method: "post",
    data: data
  });
}
