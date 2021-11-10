<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="20">
      <el-col :xs="12" :sm="24" :lg="15">
        <el-card class="box-card" style="margin-bottom:40px">
          <div slot="header" class="clearfix">
            <svg-icon icon-class="earth" style="margin-right:10px"></svg-icon>
            <span style="font-size:17px;line-height:40px">全球地图</span>
            <div style="float:right">
              <el-select
                v-model="mapColor"
                class="input-width"
                placeholder="颜色选择"
                style="width:120px;"
                size="medium"
                @change="changeColor()"
              >
                <el-option label="颜色主题1" :value="1"></el-option>
                <el-option label="颜色主题2" :value="2"></el-option>
                <el-option label="颜色主题3" :value="3"></el-option>
                <el-option label="颜色主题4" :value="4"></el-option>
                <el-option label="颜色主题5" :value="5"></el-option>
              </el-select>
            </div>
          </div>
          <world-map :mapColor="mapColor" ref="worldMapRef" />
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="24" :lg="9">
        <el-card class="box-card" style="margin-bottom:30px">
          <div slot="header" class="clearfix">
            <svg-icon icon-class="navigation-color" style="margin-right:10px"></svg-icon>
            <span>便捷导航</span>
          </div>
          <div>
            <el-row :gutter="20" class="panel-group">
              <el-col
                :lg="12"
                class="card-panel-col"
                v-for="(item, index) in historyView"
                :key="index"
                v-if="index < 2"
              >
                <div class="card-panel" @click="handlePushRoute(item.path)">
                  <div class="card-panel-icon-wrapper icon-people">
                    <svg-icon :icon-class="item.icon" class-name="card-panel-icon" />
                  </div>
                  <div class="card-panel-description">
                    <div class="card-panel-text">{{ item.name}}</div>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="panel-group" style="margin-bottom:-20px">
              <el-col
                :lg="12"
                class="card-panel-col"
                v-for="(item, index) in historyView"
                :key="index"
                v-if="index >= 2"
              >
                <div class="card-panel" @click="handlePushRoute(item.path)">
                  <div class="card-panel-icon-wrapper icon-people">
                    <svg-icon :icon-class="item.icon" class-name="card-panel-icon" />
                  </div>
                  <div class="card-panel-description">
                    <div class="card-panel-text">{{ item.name}}</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <notice-panel :noticeList="this.noticeList"></notice-panel>
      </el-col>
    </el-row>
    <!-- 系统消息提示 -->
    <MessageDialog :messageList="this.messageList" />
  </div>
</template>
<script>
import { setStore, getStore, removeStore } from '@/utils/store'
import MessageDialog from './components/MessageDialog'
import NoticePanel from './components/NoticePanel'
import OperateLog from './components/OperateLog'
import { getHomeData } from '@/api/common/home'
import WorldMap from './components/WorldMap'
const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
}
export default {
  name: 'Home',
  components: {
    WorldMap,
    NoticePanel,
    MessageDialog,
    OperateLog,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      adviceDialogVisible: false,
      noticeDialogVisible: false,
      dataSummary: [],
      operateLog: {
        list: [],
        total: 0,
      },
      noticeList: [],
      operateLog: [],
      messageList: [],
      historyView: [],
      reverse: true,
      mapColor: getStore({ name: 'map-color' }) ?? 5,
    }
  },
  created() {
    this.getHomeData()
    this.historyView =
      getStore({ name: 'cms_history_view' }) == undefined
        ? []
        : getStore({ name: 'cms_history_view' })
  },
  methods: {
    changeColor() {
      setStore({ name: 'map-color', content: this.mapColor })
      this.$refs['worldMapRef'].changeColor(this.mapColor)
      this.msgSuccess('更换颜色主题成功')
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    getHomeData() {
      getHomeData(this.listQuery).then((response) => {
        if (response.code == 200) {
          const data = response.data
          this.dataSummary = data.dataSummary
          this.operateLog = data.operate_log
          this.noticeList = data.notice_list
          const clearStorageList = data.clearStorageList
          this.clearStorage(clearStorageList)
        }
      })
    },
    clearStorage(storageList) {
      for (let i in storageList) {
        removeStore({ name: storageList[i] })
      }
    },
    handlePushRoute(url) {
      if (url == '') this.msgError('暂未开放该功能')
      this.$router.push(url)
    },
  },
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
.panel-group {
  .card-panel-col {
    margin-bottom: 32px;
  }
  .card-panel {
    height: 90px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
        background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shopping {
        background: #34bfa3;
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 4px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 38px;
    }
    .card-panel-description {
      float: left;
      font-weight: bold;
      margin: 26px;
      margin-left: 20px;
      .card-panel-text {
        line-height: 20px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 14px;
      }
    }
  }
}
</style>