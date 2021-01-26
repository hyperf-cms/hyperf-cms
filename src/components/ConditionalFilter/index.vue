<template>
  <el-card class="filter-container" shadow="never">
    <div>
      <i class="el-icon-search"></i>
      <span>筛选搜索</span>
      <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">查询搜索</el-button>
      <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()" size="small">重置</el-button>
    </div>
    <div style="margin-top: 30px">
      <el-form :inline="true" :model="listQuery" size="small">
        <slot name="extraForm"></slot>
      </el-form>
    </div>
  </el-card>
</template>
<script>
import { formatDate, getDefaultTime } from '@/utils/date'
import { dateSelection } from '@/mixins/dateSelection'
import { setStore, getStore, removeStore } from '@/utils/store'

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
  },
  mixins: [dateSelection],
  data() {
    return {
      lists: [],
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
  },
}
</script>
