<template>
  <div class="pagination-container">
    <slot name="tips"></slot>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="total,sizes,prev,pager,next,jumper"
      :current-page.sync="listQuery.cur_page"
      :page-size="listQuery.page_size"
      :page-sizes="pageSizes"
      :total="total"
    />
  </div>
</template>

<script>
import { setStore, getStore, removeStore } from "@/utils/store";

export default {
  name: 'Pagination',
  props: {
    total: { // 数据总数
      type: Number,
      default: 0,
    },
    pageSizes: { // 默认条目数选项
      type: Array,
      default: [10,20,50,100,150,200]
    },
    listQuery: { // 查询变量
      type: Object,
      required: true,
    }
  },
  watch: {
    listQuery: {
      deep: true,
      handler: function (val) {
        let route = this.$route.name;
        let data = getStore({name: 'pagination_selection'});
        if (data == undefined) data = {};

        this.setStorageValue(route, data);

        return val;
      }
    }
  },
  created() {
    let route = this.$route.name;
    let data = getStore({name: 'pagination_selection'});
    if (data == undefined) data = {};

    let queryData = data[route];
    let expiredAt = queryData == undefined ? 0 : queryData['storageExpiredAt'];
    let now = (new Date()).getTime();
    if (queryData == undefined || now > expiredAt) { // 判断是否没有缓存或缓存是否过期
      this.setStorageValue(route, data);
    } else {
      this.listQuery.cur_page = queryData['cur_page'];
      this.listQuery.page_size = queryData['page_size'];
    }
  },
  methods: {
    setStorageValue(route, data) {
      let queryData = {};
      queryData.cur_page = this.listQuery.cur_page;
      queryData.page_size = this.listQuery.page_size;

      let date = new Date();
      queryData.storageExpiredAt = date.getTime() + 3600 * 1000;

      data[route] = queryData;

      setStore({ name: 'pagination_selection', content: data });
    },
    handleSizeChange(val) {
      this.listQuery.cur_page = 1;
      this.listQuery.page_size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.cur_page = val;
      this.getList();
    },
    getList() {
      this.$emit('getList'); // 触发查询事件
    },
  }
}
</script>

<style lang="scss" scoped>
.pagination-container {
  margin-bottom: 15px;
}
</style>