<template>
  <el-dialog
    title="视频库"
    :visible.sync="showDialog"
    width="60%"
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-card shadow="never">
      <div>
        <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">查询搜索</el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
        >重置</el-button>
      </div>
      <el-form :inline="true" :model="listQuery" size="small">
        <el-form-item label="视频库：">
          <el-select
            v-model="videoType"
            default-first-option
            placeholder="请选择视频库"
          >
            <el-option label="投放视频" value="dropIn" />
            <el-option label="品牌视频" value="brand" />
            <el-option label="3D无水印" value="waterless" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间搜索：">
          <el-date-picker
            v-model="listQuery.designDate"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="游戏原名：">
          <el-select
            v-model="listQuery.gameId"
            filterable
            default-first-option
            placeholder="请选择游戏"
            clearable
          >
            <el-option
              v-for="item in gameList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="视频名称：">
          <el-input v-model="listQuery.fileName" placeholder="请填写需要搜索的视频" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="设计师：">
          <el-select
            v-model="listQuery.uploader"
            filterable
            default-first-option
            placeholder="请选择指派用户"
            clearable
          >
            <el-option
              v-for="item in userList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="尺寸：">
          <el-select
            v-model="listQuery.filePx"
            filterable
            default-first-option
            placeholder="请选择尺寸"
            clearable
          >
            <el-option
              v-for="item in filePxList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="table-container">
      <el-table ref="demandTable" :data="list" style="width: 100%;" size="mini" border>
        <el-table-column label="视频预览" align="center" width="350">
          <template slot-scope="scope">
            <div>
              <video-play :src="scope.row.file_path" aspectRatio="15:11"></video-play>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="视频名称" align="center">
          <template slot-scope="scope">{{ scope.row.file_name }}</template>
        </el-table-column>
        <el-table-column label="尺寸大小" align="center" width="120">
          <template slot-scope="scope">{{ scope.row.file_px }}</template>
        </el-table-column>
        <el-table-column label="视频大小" align="center" width="90">
          <template slot-scope="scope">{{ scope.row.file_size }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="110">
          <template slot-scope="scope">
            <el-button type="primary" @click="selectVideo(scope.row)" v-if="selectedVideo.indexOf(scope.row.file_id) < 0">选择</el-button>
            <el-button type="primary" disabled v-else>已选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.cur_page"
        :page-size="listQuery.page_size"
        :page-sizes="[10,20,30,50,80,100]"
        :total="total"
      ></el-pagination>
    </div>
  </el-dialog>
</template>

<script>
import { dropInVideo,brandVideo,waterless } from '@/api/func/video'
import VideoPlay from '@/components/VideoPlay'
import {
  getUserList,
  getGameList,
  getFileMaterialPxList
} from "@/api/common/queryCriteria";

const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
};

export default {
  name: "VideoBank",
  components: {
    VideoPlay
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    // 是否在选择后关闭窗口
    closeAfterSelect: {
      type: Boolean,
      default: true,
    },
    // 已选择的视频的ID
    selectedVideo: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      videoType: "dropIn",
      userList: [],
      gameList: [],
      filePxList: []
    };
  },
  created() {
    this.getList();
    getUserList().then(response => {
      this.userList = response.data.list;
    });
    getGameList().then(response => {
      this.gameList = response.data.list;
    });
    getFileMaterialPxList().then(response => {
      this.filePxList = response.data.list;
    });
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.getList();
    },
    handleSearchList() {
      this.listQuery.cur_page = 1;
      this.getList();
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
      switch (this.videoType) {
        case "dropIn":
          dropInVideo(this.listQuery).then(response => {
            this.initData(response.data);
          });
          break;
        case "brand":
          brandVideo(this.listQuery).then(response => {
            this.initData(response.data);
          });
          break;
        case "waterless":
          waterless(this.listQuery).then(response => {
            this.initData(response.data);
          });
          break;
      }
    },
    initData(data) {
      this.list = data.list;
      this.total = data.total;
    },
    selectVideo(row) {
      this.$emit('selectVideo', row);
      if (this.closeAfterSelect) {
        this.showDialog = false;
        this.$emit("update:showDialog", this.showDialog);
      }
    },
    closeDialog(val) {
      this.showDialog = false;
      this.$emit("update:showDialog", this.showDialog);
    }
  }
};
</script>

<style lang="scss" scoped>
.table-container >>> .el-image__inner {
  display: block;
  width: auto;
  max-height: 200px;
}

.pagination-container {
  float: none;
}

.video {
  display: inline-block;
  width: 330px;
  height: 240px;
  text-align: center;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
  margin-right: 4px;
}
</style>