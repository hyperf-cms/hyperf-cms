<template>
  <div>
    <xlsx-workbook>
      <xlsx-sheet
        v-for="(sheet, index) in printData"
        :collection="printData"
        :key="index"
        :sheet-name="sheetName"
      />
      <xlsx-download disable-wrapper-click :filename="fileName">
        <template #default="{download}">
          <el-button
            :style="styleString"
            icon="el-icon-share"
            type="warning"
            :size="btnSize"
            @click="handleExportBtnClick"
          >{{btnContent}}</el-button>
          <input type="hidden" ref="download" @click="download" />
        </template>
      </xlsx-download>
    </xlsx-workbook>
  </div>
</template>

<script>
import { XlsxWorkbook, XlsxSheet, XlsxDownload } from "vue-xlsx";
import { formatDate } from "@/utils/date";

export default {
  name: "ExportExcel",
  components: {
    XlsxWorkbook,
    XlsxSheet,
    XlsxDownload
  },
  props: {
    // 默认文件名
    fileName: {
      type: String,
      default: "my-workbook.xlsx"
    },
    // 是否多个表格
    isMultiple: {
      type: Boolean,
      default: false
    },
    // 表格头部及其对应字段值
    sheetHeader: {
      type: Object,
      default: {}
    },
    // excel工作簿名称
    sheetName: {
      type: String,
      default: "Workbook"
    },
    // 需要导出的数据
    sheetData: {
      type: Array,
      default: []
    },
    // 导出按钮文字
    btnContent: {
      type: String,
      default: "导出Excel"
    },
    // 按钮样式
    styleString: {
      type: String,
      default: ""
    },
    // 导出前执行父组件的方法
    beforeExport: {
      type: Function,
      default: function() {
        return "default";
      }
    },
    // 是否触发父组件点击事件
    clickEvent: {
      type: Boolean,
      default: false
		},
		// 按钮大小
		btnSize: {
			type: String,
			default: 'mini'
		}
  },
  data() {
    return {
      printData: []
    };
  },
  created() {
    // this.formatData();
  },
  watch: {
    sheetData(value) {
      this.formatData();
    },
    sheetHeader: {
			handler(newVal, oldVal) {
        this.sheetHeader = newVal;
			},
			deep: true,
			immediate: true,
    }
  },
  methods: {
    formatData() {
      this.printData = []; // 先清空原来的记录
      if (this.isMultiple) {
        // 判断是否多表格打印
        this.sheetData.map(table => {
          table.map(row => {
            this.pushData(row);
          });
          this.printData.push([]); // 表格之间插入一行空行间隔
        });
      } else {
        if (Array.isArray(this.sheetData)) {
          this.sheetData.map(row => {
            this.pushData(row);
          });
        } else {
          this.pushData(this.sheetData);
        }
			}
    },
    pushData(row) {
      let rowObj = {};
      for (let key in this.sheetHeader) {
        if (key != "日期") {
          rowObj[key] = row[this.sheetHeader[key]];
        } else {
          let time = row[this.sheetHeader[key]];
          if (/^\d+$/.test(time)) {
            rowObj[key] = formatDate(new Date(time * 1000), "yyyy-MM-dd");
          } else {
            rowObj[key] = time;
          }
        }
      }
      this.printData.push(rowObj);
    },
    handleExportBtnClick() {
      if (this.clickEvent) {
        // 触发点击事件
        this.$emit("click");
      }

      if (this.beforeExport) {
        // 触发导出前事件
        let data = this.beforeExport();
        if (data != "default") {
          if (!data) return;
          this.sheetData = data;
					this.formatData(); // 重新格式化数据
        }
      }
      this.$confirm("是否导出数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.sheetData.length == 0) {
            this.$message({
              message: "没有数据可以导出",
              type: "warning"
            })
            return false;
          }
          this.$refs.download.click();
        })
        .catch(err => {});
    }
  }
};
</script>