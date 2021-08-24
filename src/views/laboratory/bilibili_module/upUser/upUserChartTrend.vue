<template>
  <div class="app-container">
    <conditional-filter
      :listQuery.sync="listQuery"
      :defaultListQuery="defaultListQuery"
      :addButton="false"
      :batchDelete="false"
      :copyExcel="false"
      :exportExcel="false"
      :tableToolTip="false"
      :list="list"
      :multipleSelection="multipleSelection"
      @getList="getList"
      @handleBatchDelete="handleBatchDelete"
      excelTitle="Up主数据趋势图"
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
          <span style="color: #969696;">（范围只能选择7天以内）</span>
        </el-form-item>
      </template>
    </conditional-filter>
    <div class="table-container">
      <el-card
        class="operate-container"
        shadow="never"
        v-for="(item, key) in list"
        :key="key"
        style="width: 100%; display: inline-block;"
      >
        <div>
          <span>{{ item.label }}</span>
          <tip :content="item.desc" placement="top"></tip>
          <ve-line :data="item" :settings="chartSettings" :toolbox="toolbox" :colors="colors"></ve-line>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import {
  upUserChartTrend,
  upUserSearch,
} from '@/api/laboratory/bilibili_module/upUser'
import { getDefaultDate } from '@/utils/date'
import Tip from '@/components/Tip'
const defaultListQuery = {
  mid: null,
  name: null,
  date: null,
}
export default {
  components: {
    Tip,
  },
  data() {
    this.colors = [
      '#d50000',
      '#aa00ff',
      '#2962ff',
      '#00bfa5',
      '#ffd600',
      '#4e342e',
      '#c4ccd3',
    ]
    this.chartSettings = {
      labelMap: {
        time: '时间',
      },
    }
    this.toolbox = {
      feature: {
        magicType: { type: ['line', 'bar'] },
        saveAsImage: {},
        restore: {},
        dataZoom: {},
        dataView: {},
      },
    }
    return {
      listQuery: Object.assign({}, defaultListQuery),
      defaultListQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: 0,
      options: [],
      loading: false,
      multipleSelection: [],
      srcList: [],
      timedStatusOptions: [],
    }
  },
  created() {
    upUserSearch().then((response) => {
      this.options = response.data.list
    })

    this.listQuery.date = getDefaultDate(6)

    const mid = this.$route.query && this.$route.query.mid
    const name = this.$route.query && this.$route.query.name
    this.listQuery.mid = mid
    this.listQuery.name = name

    this.getList()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getList() {
      let date = this.listQuery.date
      let begin =
        new Date(new Date(date[0]).toLocaleDateString()).getTime() / 1000
      let end =
        new Date(new Date(date[1]).toLocaleDateString()).getTime() / 1000 +
        86400
      if ((end - begin) / 86400 > 7) {
        this.$message({
          type: 'error',
          message: '时间范围不能超过7天',
        })

        return false
      }

      upUserChartTrend(this.listQuery).then((response) => {
        this.list = response.data.rows
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
