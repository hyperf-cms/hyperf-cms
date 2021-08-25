<template>
  <div class="app-container">
    <conditional-filter
      :listQuery.sync="listQuery"
      :defaultListQuery="defaultListQuery"
      :columns.sync="columns"
      :addButton="false"
      :batchDelete="false"
      :list="list"
      :multipleSelection="multipleSelection"
      @getList="getList"
      @handleBatchDelete="handleBatchDelete"
      excelTitle="Up主列表"
    >
      <template slot="extraForm">
        <el-form-item label="视频ID搜索：">
          <el-input
            style="width:150px"
            v-model="listQuery.bvid"
            class="input-width"
            placeholder="视频ID搜索："
            @keyup.enter.native="getList"
          ></el-input>
        </el-form-item>
        <el-form-item label="视频标题搜索：">
          <el-input
            style="width:300px"
            v-model="listQuery.title"
            class="input-width"
            placeholder="名称搜索："
            @keyup.enter.native="getList"
          ></el-input>
        </el-form-item>
        <el-form-item label="UP主ID搜索：">
          <el-select
            style="width:250px"
            v-model="listQuery.mid"
            filterable
            remote
            reserve-keyword
            placeholder="请填写搜索UP主的ID"
            :remote-method="remoteMethod"
            :loading="loading"
            clearable
          >
            <el-option v-for="item in options" :key="item.mid" :label="item.name" :value="item.mid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态选择">
          <el-select
            style="width:150px"
            v-model="listQuery.timed_status"
            clearable
            class="input-width"
            placeholder="定时状态选择："
          >
            <el-option
              v-for="dict in timedStatusOptions"
              :key="dict.dict_value"
              :label="dict.dict_label"
              :value="dict.dict_value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间选择：">
          <el-date-picker
            v-model="listQuery.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :clearable="false"
          />
        </el-form-item>
      </template>
    </conditional-filter>
    <div class="table-container">
      <el-table
        ref="upUserTable"
        :data="list"
        style="width: 100%;"
        size="mini"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          label="Bvid"
          width="150"
          align="center"
          prop="bvid"
          v-if="columns[0].visible"
        ></el-table-column>
        <el-table-column label="封面图" width="200" align="center" v-if="columns[1].visible">
          <template slot-scope="scope">
            <image-view
              :image_url="getImages(scope.row.cover)"
              :image_list="srcList"
              style="width: 200px;height: 100px"
            ></image-view>
          </template>
        </el-table-column>
        <el-table-column
          sortable
          label="标题"
          width="300"
          prop="title"
          align="center"
          v-if="columns[2].visible"
        ></el-table-column>
        <el-table-column
          label="视频描述"
          width="350"
          align="center"
          prop="desc"
          v-if="columns[3].visible"
        ></el-table-column>
        <el-table-column
          label="作者"
          width="240"
          align="center"
          prop="name"
          v-if="columns[4].visible"
        >
          <template slot-scope="scope">
            <router-link
              :to="{path:'/laboratory/bilibili_module/up_user/up_user',query:{mid:scope.row.mid}}"
              class="link-type"
            >
              <span>{{ scope.row.name }}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" align="center" prop="public_time" v-if="columns[5].visible"></el-table-column>
        <el-table-column label="播放时长" align="center" prop="duration" v-if="columns[6].visible"></el-table-column>
        <el-table-column sortable label="状态" width="80" align="center" v-if="columns[7].visible">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.timed_status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="140">
          <template slot-scope="scope">
            <el-dropdown size="mini" type="warning" trigger="click" v-if="scope.row.id != 1">
              <el-button icon="el-icon-more" type="primary" size="mini" class="button-color-violet">
                数据
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item divided>
                  <el-button
                    icon="el-icon-data-line"
                    type="primary"
                    size="mini"
                    class="button-color-green"
                    @click="handleToUpUserChartTrend(scope.row.bvid)"
                  >图表趋势</el-button>
                </el-dropdown-item>
                <el-dropdown-item divided>
                  <el-button
                    icon="el-icon-data-analysis"
                    type="danger"
                    size="mini"
                    class="button-color-pink"
                    @click="handleToUpUserDataReport(scope.row.bvid)"
                  >数据报表</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <Pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.cur_page"
        :limit.sync="listQuery.page_size"
        @pagination="getList"
      ></Pagination>
    </div>
  </div>
</template>
<script>
import { video } from '@/api/laboratory/bilibili_module/video'
import ImageView from '@/components/ImageView'
import { upUserSearch } from '@/api/laboratory/bilibili_module/upUser'
import store from '@/store'
const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
  mid: null,
  name: null,
  timed_status: null,
}
export default {
  components: {
    ImageView,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      defaultListQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: 0,
      multipleSelection: [],
      srcList: [],
      timedStatusOptions: [],
      options: [],
      columns: [
        { key: 0, field: 'bvid', label: `MID`, visible: true },
        { key: 1, field: 'cover', label: `视频封面图`, visible: true },
        { key: 2, field: 'title', label: `标题`, visible: true },
        { key: 3, field: 'desc', label: `视频描述`, visible: true },
        { key: 4, field: 'ownen', label: `作者`, visible: true },
        { key: 5, field: 'public_time', label: `发布时间`, visible: true },
        { key: 6, field: 'duration', label: `播放时长`, visible: true },
        { key: 7, field: 'timed_status', label: `定时任务状态`, visible: true },
      ],
    }
  },
  created() {
    this.getDicts('lab_video_time_status').then((response) => {
      if (response.code == 200) this.timedStatusOptions = response.data.list
    })
    upUserSearch().then((response) => {
      this.options = response.data.list
    })
    this.getList()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getList() {
      video(this.listQuery).then((response) => {
        if (response.code == 200) {
          this.list = response.data.list
          this.total = response.data.total
          for (let i = 0; i < this.list.length; i++) {
            this.srcList.push(this.getImages(this.list[i].cover))
          }
        }
      })
    },
    handleStatusChange(row) {
      let text = row.status === 0 ? '停用' : '启用'
      this.$confirm('确认要"' + text + '""' + row.desc + '"用户吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return changeStatus({
            id: row.id,
            status: row.status,
          })
        })
        .catch(function () {
          row.status = row.status === 0 ? 1 : 0
        })
    },
    handleToUpUserChartTrend(bvid) {
      this.$router.push({
        path: '/laboratory/bilibili_module/video/video_chart_trend',
        query: { bvid: bvid },
      })
    },
    handleToUpUserDataReport(bvid) {
      this.$router.push({
        path: '/laboratory/bilibili_module/video/video_data_report',
        query: { bvid: bvid },
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          upUserSearch().then((response) => {
            this.options = response.data.list.filter((item) => {
              return item.mid.toLowerCase().indexOf(query.toLowerCase()) > -1
            })
          })
        }, 200)
      } else {
        this.options = []
      }
    },
  },
}
</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>
