<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span @dblclick="showCopyExcel = true">数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table
        ref="queueTable"
        :data="list"
        style="width: 100%;margin-bottom: 10px;"
        size="mini"
        border
      >
        <el-table-column label="ID">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="连接">
          <template slot-scope="scope">{{ scope.row.connection }}</template>
        </el-table-column>
        <el-table-column label="引擎">
          <template slot-scope="scope">{{ scope.row.queue }}</template>
        </el-table-column>
        <el-table-column label="时间">
          <template slot-scope="scope">{{ scope.row.failed_at }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleViewPayload(scope.row)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.cur_page"
        :page-size="listQuery.page_size"
        :page-sizes="[10, 20, 30, 50, 80, 100]"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 详情 -->
    <el-dialog
      title="详情"
      :visible.sync="dialogVisible"
      width="800px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="(dialog, index) in this.dialogName"
          :key="index"
          :label="dialog.label"
          :name="index"
        >
          <json-viewer
            :value="dialog.dialogContent"
            :expand-depth="3"
            copyable
            boxed
            v-if="index == 'payload'"
          ></json-viewer>
          <div
            style="font-size: 16px; line-height: 22px"
            v-html="dialog.dialogContent"
            v-else
          ></div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { getQueueList } from "@/api/system/queue";
import JsonViewer from "vue-json-viewer";

const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
};

export default {
  name: "Queue",
  components: {
    JsonViewer,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: 0,
      dialogVisible: false,
      activeName: "payload",
      dialogName: {
        payload: {
          label: "载体",
          dialogContent: "",
        },
        exception: {
          label: "异常",
          dialogContent: "",
        },
      },
      dialogContent: "",
    };
  },
  created() {
    this.getList();
  },
  methods: {
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
      getQueueList(this.listQuery).then((response) => {
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    handleClick(tab, event) {
      this.activeName = tab.name;
    },
    handleViewPayload(row) {
      this.dialogVisible = true;

      for (let i in this.dialogName) {
        if (i == "exception") row[i] = row[i].replace(/\n/g, "<br>");

        this.dialogName[i].dialogContent = row[i];
      }
    },
    handleClose() {
      this.activeName = "payload";
    },
  },
};
</script>