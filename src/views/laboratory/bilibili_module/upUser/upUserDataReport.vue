<template>
  <div class="app-container">
    <conditional-filter
      :listQuery.sync="listQuery"
      :defaultListQuery="defaultListQuery"
      :addButton="false"
      :batchDelete="false"
      :list="list"
      :columns="columns"
      :multipleSelection="multipleSelection"
      @getList="getList"
      @handleBatchDelete="handleBatchDelete"
      excelTitle="Up主数据报表"
    >
      <template slot="extraForm">
        <el-form-item label="UP主ID搜索：">
          <el-select
            style="width:300px"
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
        <el-form-item label="时间范围：">
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
      <el-table ref="upUserDataReport" :data="list" style="width: 100%;" size="mini">
        <el-table-column label="time" width="150" prop="time" v-if="columns[0].visible"></el-table-column>
        <el-table-column label="关注数" prop="following" v-if="columns[1].visible"></el-table-column>
        <el-table-column label="粉丝数" prop="follower" v-if="columns[2].visible"></el-table-column>
        <el-table-column label="视频播放数" prop="video_play" v-if="columns[3].visible"></el-table-column>
        <el-table-column label="阅读数" prop="readling" v-if="columns[4].visible"></el-table-column>
        <el-table-column label="获赞数" prop="likes" v-if="columns[5].visible"></el-table-column>
        <el-table-column label="月充电数" prop="recharge_month" v-if="columns[6].visible"></el-table-column>
        <el-table-column label="总充电数" prop="recharge_total" v-if="columns[7].visible"></el-table-column>
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
import {
  upUserDataReport,
  upUserSearch,
} from '@/api/laboratory/bilibili_module/upUser'
import { getDefaultDate } from '@/utils/date'
const defaultListQuery = {
  cur_page: 1,
  page_size: 50,
  mid: null,
  name: null,
  date: null,
}
export default {
  components: {},
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      defaultListQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: 0,
      options: [],
      multipleSelection: [],
      timedStatusOptions: [],
      columns: [
        { key: 0, field: 'time', label: `时间`, visible: true },
        { key: 1, field: 'following', label: `关注数`, visible: true },
        { key: 2, field: 'follower', label: `粉丝数`, visible: true },
        { key: 3, field: 'video_play', label: `视频播放数`, visible: true },
        { key: 4, field: 'readling', label: `阅读数`, visible: true },
        { key: 5, field: 'likes', label: `获赞数`, visible: true },
        { key: 6, field: 'recharge_total', label: `月充电数`, visible: true },
        { key: 7, field: 'recharge_month', label: `总充电数`, visible: true },
      ],
    }
  },
  created() {
    upUserSearch().then((response) => {
      this.options = response.data.list
    })

    this.listQuery.date = getDefaultDate(1)

    const mid = this.$route.query && this.$route.query.mid
    const name = this.$route.query && this.$route.query.name
    this.listQuery.mid = mid
    this.listQuery.name = name

    this.getList()
  },
  methods: {
    getList() {
      let date = this.listQuery.date
      let begin =
        new Date(new Date(date[0]).toLocaleDateString()).getTime() / 1000
      let end =
        new Date(new Date(date[1]).toLocaleDateString()).getTime() / 1000 +
        86400
      upUserDataReport(this.listQuery).then((response) => {
        this.list = response.data.list
        this.total = response.data.total
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
