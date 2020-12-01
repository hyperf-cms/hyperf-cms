<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" :dataSummary="dataSummary" />
    <el-row :gutter="20">
      <el-col :xs="12" :sm="24" :lg="16">
        <div class="app-container" style="margin-top: -35px">
          <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>数据列表</span>
          </el-card>
          <div class="table-container">
            <el-table ref="demandTable" :data="operateLog.list" style="width: 100%;" size="small">
              <el-table-column label="ID" width="60" align="center">
                <template slot-scope="scope">
                  {{ scope.row.id}}
                </template>
              </el-table-column>
              <el-table-column label="用户名" width="180">
                <template slot-scope="scope">{{scope.row.username}}</template>
              </el-table-column>
              <el-table-column label="操作昵称" width="180">
                <template slot-scope="scope">{{scope.row.operator}}</template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">{{scope.row.action}}</template>
              </el-table-column>
              <el-table-column label="结果" width="150" :show-overflow-tooltip="true">
                <template slot-scope="scope">{{scope.row.dealResult}}</template>
              </el-table-column>
              <el-table-column label="请求参数" :show-overflow-tooltip="true">
                <template slot-scope="scope">{{scope.row.data}}</template>
              </el-table-column>
              <el-table-column label="操作时间" width="180">
                <template slot-scope="scope">{{scope.row.created_at | formatCreateTime }}</template>
              </el-table-column>
            </el-table>
          </div>
          <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.cur_page" :page-size="listQuery.page_size" :page-sizes="[10,20,30,50,80,100]" :total="operateLog.total">
            </el-pagination>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="24" :lg="8">
        <notice-panel :noticeList="this.noticeList"></notice-panel>
      </el-col>
    </el-row>
    <!-- 内容展示 -->
    <el-dialog title="内容展示" :visible.sync="contentDialogVisible" width="85%" :close-on-click-modal="false">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>内容展示</span>
        </div>
        <div class="text item">
          <div class="content" v-html="content"></div>
        </div>
      </el-card>
      <br>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>视频展示</span>
        </div>
        <div class="text item">
          <video-play v-for="(item, key) in videoList" :key="key" :src="item"></video-play>
        </div>
      </el-card>
      <br>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>附件下载</span>
        </div>
        <div class="text item">
          <el-table :data="enclosure" style="width: 80%;" size="mini">
            <el-table-column type="selection" width="60" align="center"></el-table-column>
            <el-table-column label="ID" width="600" align="center">
              <template slot-scope="scope">
                {{ scope.row}}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="140">
              <template slot-scope="scope">
                <el-button icon="el-icon-download" type="primary" size="mini" class="button-color-violet" @click="download(scope.row)">
                  下载
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <div slot="footer">
        <el-button size="small" @click="contentDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <!-- <transaction-table /> -->
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <!-- <todo-list /> -->
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <!-- <box-card /> -->
      </el-col>
    </el-row>
    <!-- 系统消息提示 -->
    <MessageDialog :messageList="this.messageList" />
  </div>
</template>
<script>
import { getHomeData } from '@/api/system/homeData';
import { getAdviceReply } from '@/api/system/advice';
import { setStore, getStore, removeStore } from "@/utils/store";
import MessageDialog from './components/MessageDialog';
import NoticePanel from './components/NoticePanel';
import PanelGroup from './components/PanelGroup';
const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
};
export default {
  name: 'Home',
  components: {
    PanelGroup,
    NoticePanel,
    MessageDialog,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      adviceDialogVisible: false,
      noticeDialogVisible: false,
      dataSummary: [],
      operateLog: {
        list : [],
        total: 0
      },
      noticeList: [],
      messageList: [],
    }
  },
  created() {
    this.getHomeData();
  },
  filters: {
    formatLoginTime(time) {
      let date = new Date(time * 1000);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    handleViewContent(data) {
      this.content = data.content;
      this.videoList = JSON.parse(data.video)
      this.enclosure = JSON.parse(data.enclosure)
      this.contentDialogVisible = true;
    },
    getHomeData() {
      getHomeData(this.listQuery).then(response => {
        const data = response.data;
        this.dataSummary = data.dataSummary;
        this.operateLog = data.operateLog;
        this.noticeList = data.noticeList.list

        let latestNoticeList = [];
        if (data.noticeList.latest_id.length > 0) {
          latestNoticeList = this.getLatestNotice(data.noticeList.latest_id, this.noticeList);
        }
        if (data.adviceReplyList.length > 0) {
          for (let i in data.adviceReplyList) {
            data.adviceReplyList[i]['messageType'] = 'advice';
          }
        }
        this.messageList = latestNoticeList.concat(data.adviceReplyList);

        const clearStorageList = data.clearStorageList;
        this.clearStorage(clearStorageList);
      });
    },
    getLatestNotice(latest_id, noticeList) {
      let temp = [];
      for (let i in latest_id) {
        for (let j in noticeList) {
          if (latest_id[i] == noticeList[j].id) { // 从通知列表中获取最新未读通知
            noticeList[j]['messageType'] = 'notice';
            temp.push(noticeList[j]);
            break;
          }
        }
      }

      return temp;
    },
    clearStorage(storageList) {
      for (let i in storageList) {
        removeStore({ name: storageList[i] });
      }
    },
    handleSizeChange(val) {
      this.listQuery.cur_page = 1;
      this.listQuery.page_size = val;
      this.getHomeData();
    },
    handleCurrentChange(val) {
      this.listQuery.cur_page = val;
      this.getHomeData();
    },
  }
}

</script>
<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
  }
}

</style>
