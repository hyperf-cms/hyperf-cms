<template>
  <el-dialog
    title="图片库"
    :visible.sync="showDialog"
    width="60%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
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
        <el-form-item label="图片库：">
          <el-select
            v-model="imgType"
            default-first-option
            placeholder="请选择图片库"
          >
            <el-option label="设计图" value="design" />
            <el-option label="投放图" value="dropIn" />
            <el-option label="视频封面" value="videoCover" />
            <el-option label="视频背景" value="videoBg" />
            <el-option label="ICON图标" value="icon" />
            <el-option label="LOGO图标" value="logo" />
            <el-option label="组合五图" value="fivePhoto" />
            <el-option label="落地页图" value="landingPage" />
            <el-option label="登录Loading" value="loginLoading" />
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
        <el-form-item label="图片名称：">
          <el-input v-model="listQuery.fileName" placeholder="请填写需要搜索的图片" style="width: 350px"></el-input>
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
        <el-table-column label="图片预览" align="center">
          <template slot-scope="scope">
            <el-image
              :src="scope.row.file_path"
              :preview-src-list="srcList"
              :close-on-press-escape="true"
            />
          </template>
        </el-table-column>
        <el-table-column label="图片名称" align="center">
          <template slot-scope="scope">{{ scope.row.file_name }}</template>
        </el-table-column>
        <el-table-column label="尺寸大小" align="center" width="90">
          <template slot-scope="scope">{{ scope.row.file_px }}</template>
        </el-table-column>
        <el-table-column label="图片大小" align="center" width="90">
          <template slot-scope="scope">{{ scope.row.file_size }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="95">
          <template slot-scope="scope">
            <el-button type="primary" @click="selectImg(scope.row)">选择</el-button>
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
import { designPhoto,dropInPhoto,videoCover,videoBg,icon,logo,fivePhoto,landingPage,loginLoading } from "@/api/func/photo";
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
  name: "ImgBank",
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      srcList: [],
      imgType: "dropIn",
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
      this.srcList = [];
      switch (this.imgType) {
        case "dropIn":
          dropInPhoto(this.listQuery).then(response => {
            this.initData(response.data);
          });
          break;
        case "design":
          designPhoto(this.listQuery).then(response => {
            this.initData(response.data);
          });
          break;
        case "videoCover":
          videoCover(this.listQuery).then(response => {
            this.initData(response.data);
          });
          break;
        case "videoBg":
          videoBg(this.listQuery).then(response => {
            this.initData(response.data);
          });
          break;
        case "icon":
          icon(this.listQuery).then(response => {
            this.initData(response.data);
          });
          break;
        case "logo":
          logo(this.listQuery).then(response => {
            this.initData(response.data);
          });
          break;
        case "fivePhoto":
          fivePhoto(this.listQuery).then(response => {
            this.initData(response.data);
          });
          break;
        case "landingPage":
          landingPage(this.listQuery).then(response => {
            this.initData(response.data);
          });
          break;
        case "loginLoading":
          loginLoading(this.listQuery).then(response => {
            this.initData(response.data);
          });
          break;
      }
    },
    initData(data) {
      this.list = data.list;
      this.total = data.total;
      for (var i = 0; i <= this.list.length - 1; i++) {
        this.srcList.push(this.list[i].file_path);
      }
    },
    selectImg(row) {
      this.showDialog = false;
      this.$emit('selectImg', row);
      this.$emit("update:showDialog", this.showDialog);
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
</style>