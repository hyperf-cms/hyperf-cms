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
      excelTitle="视频数据报表"
    >
      <template slot="extraForm">
        <el-form-item label="视频ID搜索：">
          <el-select
            style="width:300px"
            v-model="listQuery.bvid"
            filterable
            remote
            reserve-keyword
            placeholder="请填写搜索视频的ID"
            :remote-method="remoteMethod"
            :loading="loading"
            clearable
          >
            <el-option
              v-for="item in options"
              :key="item.bvid"
              :label="item.title"
              :value="item.bvid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围：">
          <el-date-picker
            v-model="listQuery.date"
            :picker-options="pickerOptions"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :clearable="true"
            :editable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-form-item>
        <el-form-item label="趋势预览：">
          <el-select
            style="width:200px"
            v-model="listQuery.is_trend"
            filterable
            placeholder="是否开启趋势预览"
            clearable
          >
            <el-option label="开启" :value="1"></el-option>
            <el-option label="关闭" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </template>
    </conditional-filter>
    <div class="table-container">
      <el-table ref="videoDataReport" :data="list" style="width: 100%;" size="mini" border>
        <el-table-column label="time" sortable width="150" prop="time" v-if="columns[0].visible"></el-table-column>
        <el-table-column label="视频播放数" sortable prop="view" v-if="columns[1].visible">
          <template slot-scope="scope">
            {{scope.row.view}}
            <span v-if="listQuery.is_trend == 1">
              （
              <svg-icon icon-class="upward_trend" v-if="scope.row.view_trend > 0"></svg-icon>
              <svg-icon icon-class="down_trend" v-if="scope.row.view_trend < 0"></svg-icon>
              {{scope.row.view_trend}}
              ）
            </span>
          </template>
        </el-table-column>
        <el-table-column label="弹幕数" sortable prop="danmaku" v-if="columns[2].visible">
          <template slot-scope="scope">
            {{scope.row.danmaku}}
            <span v-if="listQuery.is_trend == 1">
              （
              <svg-icon icon-class="upward_trend" v-if="scope.row.danmaku_trend > 0"></svg-icon>
              <svg-icon icon-class="down_trend" v-if="scope.row.danmaku_trend < 0"></svg-icon>
              {{scope.row.danmaku_trend}}
              ）
            </span>
          </template>
        </el-table-column>
        <el-table-column label="评论数" sortable prop="reply" v-if="columns[3].visible">
          <template slot-scope="scope">
            {{scope.row.reply}}
            <span v-if="listQuery.is_trend == 1">
              （
              <svg-icon icon-class="upward_trend" v-if="scope.row.reply_trend > 0"></svg-icon>
              <svg-icon icon-class="down_trend" v-if="scope.row.reply_trend < 0"></svg-icon>
              {{scope.row.reply_trend}}
              ）
            </span>
          </template>
        </el-table-column>
        <el-table-column label="收藏数" sortable prop="favorite" v-if="columns[4].visible">
          <template slot-scope="scope">
            {{scope.row.favorite}}
            <span v-if="listQuery.is_trend == 1">
              （
              <svg-icon icon-class="upward_trend" v-if="scope.row.favorite_trend > 0"></svg-icon>
              <svg-icon icon-class="down_trend" v-if="scope.row.favorite_trend < 0"></svg-icon>
              {{scope.row.favorite_trend}}
              ）
            </span>
          </template>
        </el-table-column>
        <el-table-column label="硬币枚数" sortable prop="coin" v-if="columns[5].visible">
          <template slot-scope="scope">
            {{scope.row.coin}}
            <span v-if="listQuery.is_trend == 1">
              （
              <svg-icon icon-class="upward_trend" v-if="scope.row.coin_trend > 0"></svg-icon>
              <svg-icon icon-class="down_trend" v-if="scope.row.coin_trend < 0"></svg-icon>
              {{scope.row.coin_trend}}
              ）
            </span>
          </template>
        </el-table-column>
        <el-table-column label="点赞数" sortable prop="likes" v-if="columns[6].visible">
          <template slot-scope="scope">
            {{scope.row.likes}}
            <span v-if="listQuery.is_trend == 1">
              （
              <svg-icon icon-class="upward_trend" v-if="scope.row.likes_trend > 0"></svg-icon>
              <svg-icon icon-class="down_trend" v-if="scope.row.likes_trend < 0"></svg-icon>
              {{scope.row.likes_trend}}
              ）
            </span>
          </template>
        </el-table-column>
        <el-table-column label="踩数" sortable prop="dislike" v-if="columns[7].visible">
          <template slot-scope="scope">
            {{scope.row.dislike}}
            <span v-if="listQuery.is_trend == 1">
              （
              <svg-icon icon-class="upward_trend" v-if="scope.row.dislike_trend > 0"></svg-icon>
              <svg-icon icon-class="down_trend" v-if="scope.row.dislike_trend < 0"></svg-icon>
              {{scope.row.dislike_trend}}
              ）
            </span>
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
import {
  videoDataReport,
  videoSearch,
} from '@/api/laboratory/bilibili_module/video'
import { getDefaultDate } from '@/utils/date'
const defaultListQuery = {
  cur_page: 1,
  page_size: 50,
  bvid: null,
  name: null,
  date: null,
  is_trend: null,
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
        { key: 1, field: 'view', label: `视频播放数`, visible: true },
        { key: 2, field: 'danmaku', label: `弹幕数`, visible: true },
        { key: 3, field: 'reply', label: `评论数`, visible: true },
        { key: 4, field: 'favorite', label: `收集数`, visible: true },
        { key: 5, field: 'coin', label: `硬币枚数`, visible: true },
        { key: 6, field: 'likes', label: `点赞数`, visible: true },
        { key: 7, field: 'dislike', label: `踩数`, visible: true },
      ],
    }
  },
  created() {
    videoSearch().then((response) => {
      this.options = response.data.list
    })

    this.listQuery.date = getDefaultDate(1)

    const bvid = this.$route.query && this.$route.query.bvid
    const name = this.$route.query && this.$route.query.name
    this.listQuery.bvid = bvid
    this.listQuery.name = name

    this.getList()
  },
  methods: {
    getList() {
      videoDataReport(this.listQuery).then((response) => {
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          videoSearch().then((response) => {
            this.options = response.data.list.filter((item) => {
              return item.bvid.toLowerCase().indexOf(query.toLowerCase()) > -1
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
