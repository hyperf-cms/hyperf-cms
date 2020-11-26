<template>
  <span>
    <el-button style="float:right;margin-right: 15px; margin-bottom: 2px;text-align: center" @click="getExcelList()" size="mini" type="warning">
      导出excel
    </el-button>
  </span>
</template>
<script>
import { getPidSearch } from '@/api/search/search'
export default {
  props: {
    //表格数据
    tableData: {
      default: [],
    },
    //表头列表
    tableHeader: {
      default: [],
    },
    //表格标题
    tableTitle: {
      default: 'Excel表格'
    },
    //表格字段
    filterVal: {
      default: []
    }
  },
  watch: {
    tableData(value) {
      this.exportToExcel()
    }
  },
  methods: {
    getExcelList() {
      this.$emit('exportExcel')
    },
    exportToExcel() {
      // excel数据导出
      require.ensure([], () => {
        const {
          export_json_to_excel
        } = require('../../assets/js/Export2Excel');
        const tHeader = this.tableHeader
        const filterVal = this.filterVal;
        const data = this.formatJson(filterVal, this.tableData);
        export_json_to_excel(tHeader, data, this.tableTitle);
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  },


}

</script>
</style>
