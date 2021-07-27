<template>
  <div>
    <el-card class="filter-container" shadow="never" v-if="showSearch">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">查询搜索</el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
        >重置</el-button>
      </div>
      <div style="margin-top: 30px">
        <el-form :inline="true" :model="listQuery" size="small">
          <slot name="extraForm"></slot>
        </el-form>
      </div>
    </el-card>
    <div class="operate-container" style="height:30px">
      <el-button
        style="float: left;"
        icon="el-icon-plus"
        type="primary"
        size="small"
        plain
        v-if="addButton"
        @click="handleAdd"
      >新增</el-button>
      <el-button
        style="float: left;"
        icon="el-icon-delete"
        type="danger"
        size="small"
        v-if="batchDelete"
        :disabled="multipleSelection.length == 0"
        plain
        @click="handleBatchDelete"
      >删除</el-button>
      <el-button
        style="float: left;"
        icon="el-icon-download"
        type="warning"
        size="small"
        plain
        @click="handleExportExcel"
      >导出Excel</el-button>
      <el-button
        style="float: left;"
        icon="el-icon-copy-document"
        type="success"
        size="small"
        plain
        @click="handleCopyExcel"
      >复制Excel</el-button>
      <span class="excel_copy" ref="copy" :data-clipboard-text="excelContent" @click="copy"></span>
      <slot name="extraButton"></slot>
      <el-popover placement="bottom" trigger="click" style="float:right;margin-right:10px;">
        <el-checkbox-group v-model="checkedColumns">
          <el-checkbox
            v-for="item in columns"
            :label="item.label"
            :key="item.key"
            @change="handleCheckedColumnsChange(item.label, $event)"
          >{{item.label}}</el-checkbox>
        </el-checkbox-group>
        <el-button
          slot="reference"
          style="float: right;"
          icon="el-icon-menu"
          size="small"
          type="primary"
          circle
          plain
        ></el-button>
      </el-popover>
      <el-tooltip
        class="item"
        effect="dark"
        :content="showSearch ? '隐藏搜索' : '显示搜索'"
        placement="top"
      >
        <el-button
          style="float: right;margin-right:10px"
          circle
          icon="el-icon-search"
          size="small"
          type="primary"
          :plain="showSearch ? false : true"
          @click="toggleSearch"
        ></el-button>
      </el-tooltip>
      <div style="height: 0; overflow: hidden;" v-html="excelContent"></div>
    </div>
  </div>
</template>
<script>
import { formatDate, getDefaultTime } from '@/utils/date'
import { dateSelection } from '@/mixins/dateSelection'
import { setStore, getStore, removeStore } from '@/utils/store'
import { getExcelContent } from '@/api/common/excel'
import Clipboard from 'clipboard'
import tableExport from '@/assets/js/exportExcel/tableExport.min.js'

export default {
  name: 'conditionalFilter',
  props: {
    // 默认条件
    defaultListQuery: {
      type: Object,
      default: {},
    },
    // 搜索条件
    listQuery: {
      type: Object,
      default: {},
    },
    columns: {
      type: Object,
      default: {},
    },
    list: {
      type: String,
      default: '',
    },
    excelTitle: {
      type: String,
      default: '',
    },
    multipleSelection: {
      type: Array,
      default: [],
    },
    batchDelete: {
      type: Boolean,
      default: true,
    },
    addButton: {
      type: Boolean,
      default: true,
    },
  },
  mixins: [dateSelection],
  data() {
    return {
      lists: [],
      checkedColumns: this.columns.map((o) => {
        return [o.label].toString()
      }),
      showSearch: true,
    }
  },
  watch: {
    listQuery: {
      deep: true,
      handler: function (val) {
        let route = this.$route.name
        let data = getStore({ name: 'query_selection' })
        if (data == undefined) data = {}
        this.setStorageValue(route, data)
        return val
      },
    },
  },
  created() {
    //监听回车事件
    this.enterSearch()

    if (Object.keys(this.$route.params).length == 0) {
      // 从缓存读取指定筛选项
      let route = this.$route.name
      let data = getStore({ name: 'query_selection' })
      if (data == undefined) data = {}

      //从query_selection 获取当前路由的筛选缓存
      let queryData = data[route]
      let expiredAt = queryData == undefined ? 0 : queryData['storageExpiredAt']
      let now = new Date().getTime()

      if (queryData == undefined || now > expiredAt) {
        this.setStorageValue(route, data)
      } else {
        for (let i in queryData) {
          if (i == 'storageExpiredAt') continue
          this.$set(this.listQuery, i, queryData[i])
        }
      }
    }
  },
  methods: {
    /**
     * 设置筛选项到缓存当中
     */
    setStorageValue(route, data) {
      let queryData = {}
      let date = new Date()
      queryData.storageExpiredAt = date.getTime() + 3600 * 1000

      for (let i in this.listQuery) {
        this.$set(queryData, i, this.listQuery[i])
      }

      data[route] = queryData
      setStore({ name: 'query_selection', content: data })
    },
    /**
     * 重置筛选项
     */
    handleResetSearch() {
      this.listQuery = Object.assign({}, this.defaultListQuery)
      this.$emit('update:listQuery', this.listQuery) // 同步更新父组件的listQuery
      this.getList()
    },
    /**
     * 查询
     */
    handleSearchList() {
      this.getList()
    },
    /**
     * 获取查询列表
     */
    getList() {
      this.$emit('update:listQuery', this.listQuery) // 同步更新父组件的listQuery
      this.$emit('getList') // 触发查询事件
    },
    /**
     * 监听回车事件
     */
    enterSearch() {
      document.onkeydown = (e) => {
        //13表示回车键，baseURI是当前页面的地址，为了更严谨，也可以加别的，可以打印e看一下
        if (e.keyCode === 13 && e.target.baseURI.match(/freshmanage/)) {
          //回车后执行搜索方法
        }
      }
    },
    /**
     * 显示/隐藏搜索
     */
    toggleSearch() {
      this.showSearch = !this.showSearch
    },
    /**
     * 显示/隐藏列
     */
    handleCheckedColumnsChange(label, $event) {
      for (let i = 0; i < this.columns.length; i++) {
        if (label == this.columns[i].label) {
          this.columns[i].visible = $event
        }
      }
      this.$emit('update:columns', this.columns) // 同步更新父组件的listQuery

      let checkedCount = this.columns.length
      this.checkAll = checkedCount === this.checkedColumns.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount > this.checkedColumns.length
    },
    /**
     * 导出Excel
     */
    handleExportExcel() {
      this.$confirm('确认导出数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          let table_header = []
          let table_header_mean = {}
          for (let i = 0; i < this.columns.length; i++) {
            if (this.columns[i].field != '') {
              table_header.push(this.columns[i].field)
              table_header_mean[this.columns[i].field] = this.columns[i].label
            }
          }
          getExcelContent({
            data: this.list,
            table_header: table_header,
            table_header_mean: table_header_mean,
          }).then((response) => {
            this.excelContent = response.data.excel_content
            // 兼容ios
            this.$forceUpdate()
            setTimeout(() => {
              //模拟点击真正复制链接的按钮
              $('#tables').tableExport({
                type: 'excel',
                escape: 'true',
                fileName: this.excelTitle,
              })
            }, 10)
          })
        })
        .catch((err) => {})
    },
    /**
     * 复制Excel表格数据
     */
    handleCopyExcel() {
      let table_header = []
      let table_header_mean = {}
      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i].field != '') {
          table_header.push(this.columns[i].field)
          table_header_mean[this.columns[i].field] = this.columns[i].label
        }
      }
      getExcelContent({
        data: this.list,
        table_header: table_header,
        table_header_mean: table_header_mean,
      }).then((response) => {
        this.excelContent = response.data.excel_content
        // 兼容ios
        this.$forceUpdate()
        setTimeout(() => {
          //模拟点击真正复制链接的按钮
          this.$refs.copy.click()
        }, 10)
      })
    },
    /**
     * 复制
     */
    copy(event) {
      event.preventDefault()
      var clipboard = new Clipboard('.excel_copy')
      clipboard.on('success', (e) => {
        this.msgSuccess('复制Excel表格成功')
        //  释放内存
        clipboard.destroy()
      })
      clipboard.on('error', (e) => {
        // 不支持复制
        this.msgError('该浏览器不支持复制')
        // 释放内存
        clipboard.destroy()
      })
    },
    /**
     * 添加事件
     */
    handleAdd() {
      this.$emit('handleAdd') // 触发添加
    },
    /**
     * 删除事件
     */
    handleBatchDelete() {
      this.$emit('handleBatchDelete') // 触发删除
    },
  },
}
</script>
