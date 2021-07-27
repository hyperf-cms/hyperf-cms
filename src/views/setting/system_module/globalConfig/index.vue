<template>
  <div class="app-container">
    <conditional-filter
      :listQuery.sync="listQuery"
      :defaultListQuery="defaultListQuery"
      :columns.sync="columns"
      :list="list"
      :multipleSelection="multipleSelection"
      @getList="getList"
      @handleAdd="handleAdd"
      @handleBatchDelete="handleBatchDelete"
      excelTitle="参数设置"
    >
      <template slot="extraForm">
        <el-form-item label="名称搜索：">
          <el-input
            v-model="listQuery.name"
            class="input-width"
            placeholder="名称搜索："
            style="width:300px;"
            @keyup.enter.native="getList"
          ></el-input>
        </el-form-item>
        <el-form-item label="KeyName搜索：">
          <el-input
            v-model="listQuery.name"
            class="input-width"
            placeholder="KeyName搜索："
            style="width:300px;"
            @keyup.enter.native="getList"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型筛选：">
          <el-select v-model="listQuery.type" clearable placeholder="类型筛选">
            <el-option
              v-for="(item, index) in typeOptions"
              :key="index"
              :value="item.dict_value"
              :label="item.dict_label"
            ></el-option>
          </el-select>
        </el-form-item>
      </template>
    </conditional-filter>
    <div class="table-container">
      <el-table
        ref="globalConfigTable"
        :data="list"
        style="width: 100%;"
        size="mini"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="ID" align="center" width="80" prop="id" v-if="columns[0].visible"></el-table-column>
        <el-table-column
          label="名称"
          align="center"
          prop="name"
          width="200"
          v-if="columns[1].visible"
        ></el-table-column>
        <el-table-column
          label="类型"
          align="center"
          prop="type"
          width="120"
          :formatter="typeFormat"
          v-if="columns[2].visible"
        ></el-table-column>
        <el-table-column
          label="KeyName"
          align="center"
          prop="key_name"
          width="150"
          v-if="columns[3].visible"
        ></el-table-column>
        <el-table-column
          label="数据"
          align="center"
          prop="data"
          :show-overflow-tooltip="true"
          v-if="columns[4].visible"
        ></el-table-column>
        <el-table-column label="备注" align="center" prop="remark" v-if="columns[5].visible"></el-table-column>
        <el-table-column
          label="创建时间"
          width="180"
          align="center"
          prop="created_at"
          v-if="columns[6].visible"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="handleDelete(scope.row)"
            >删除</el-button>
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

    <!-- 添加/修改全局配置 -->
    <global-config-detail
      ref="globalConfigDetail"
      :globalConfigDetailDialogData="globalConfigDetailDialogData"
    ></global-config-detail>
  </div>
</template>
<script>
import {
  globalConfigList,
  deleteGlobalConfig,
} from '@/api/setting/system_module/globalConfig'
import GlobalConfigDetail from './components/GlobalConfigDetail'
const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
  name: '',
  key_name: '',
  type: '',
}
export default {
  components: {
    GlobalConfigDetail,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      defaultListQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: 0,
      columns: [
        { key: 0, field: 'id', label: `ID`, visible: true },
        { key: 1, field: 'name', label: `名称`, visible: true },
        { key: 2, field: 'type', label: `类型`, visible: true },
        { key: 3, field: 'key_name', label: `KeyName`, visible: true },
        { key: 4, field: 'data', label: `数据`, visible: true },
        { key: 5, field: 'remark', label: `备注`, visible: true },
        { key: 5, field: 'created_at', label: `创建时间`, visible: true },
      ],
      typeOptions: [],
      multipleSelection: [],
      globalConfigDetailDialogData: {
        globalConfigDetailDialogVisible: false,
        typeOptions: [],
        globalConfigDetailTitle: '',
        isEdit: false,
        id: '',
      },
    }
  },
  created() {
    this.getDicts('sys_global_config_type').then((response) => {
      if (response.code == 200) this.typeOptions = response.data.list
    })
    this.getList()
  },
  filters: {},
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleAdd() {
      this.globalConfigDetailDialogData.globalConfigDetailDialogVisible = true
      this.globalConfigDetailDialogData.typeOptions = this.typeOptions
      this.globalConfigDetailDialogData.globalConfigDetailTitle = '添加全局配置'
      this.globalConfigDetailDialogData.isEdit = false
      this.$refs['globalConfigDetail'].getGlobalConfigInfo()
    },
    handleEdit(row) {
      this.globalConfigDetailDialogData.globalConfigDetailDialogVisible = true
      this.globalConfigDetailDialogData.typeOptions = this.typeOptions
      this.globalConfigDetailDialogData.globalConfigDetailTitle =
        '修改 "' + row.name + '" 全局配置'
      this.globalConfigDetailDialogData.isEdit = true
      this.globalConfigDetailDialogData.id = row.id
      this.$refs['globalConfigDetail'].getGlobalConfigInfo()
    },
    handleDelete(row) {
      this.deleteGlobalConfig(row.id)
    },
    handleBatchDelete() {
      let id_arr = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        id_arr.push(this.multipleSelection[i].id)
      }
      this.deleteGlobalConfig(id_arr, true)
    },
    getList() {
      globalConfigList(this.listQuery).then((response) => {
        if (response.code == 200) {
          this.total = response.data.total
          this.list = response.data.list
        }
      })
    },
    deleteGlobalConfig(id, isBatch = false) {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (isBatch) {
          deleteGlobalConfig(0, { id: id }).then((response) => {
            if (response.code == 200) {
              this.multipleSelection = []
              this.getList()
            }
          })
        } else {
          deleteGlobalConfig(id).then((response) => {
            if (response.code == 200) {
              this.multipleSelection = []
              this.getList()
            }
          })
        }
      })
    },
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type)
    },
  },
}
</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>
