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
      excelTitle="字典数据"
    >
      <template slot="extraForm">
        <el-form-item label="字典名称">
          <el-select v-model="listQuery.dict_type" size="small" filterable>
            <el-option
              v-for="item in dictTypeList"
              :key="item.dict_id"
              :label="item.dict_name"
              :value="item.dict_type"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="字典标签">
          <el-input
            v-model="listQuery.dict_label"
            placeholder="请输入字典标签"
            clearable
            size="small"
            @keyup.enter.native="getList"
          />
        </el-form-item>
        <el-form-item label="状态选择：">
          <el-select v-model="listQuery.status" clearable class="input-width" placeholder="状态选择：">
            <el-option value="1" label="正常"></el-option>
            <el-option value="0" label="停用"></el-option>
          </el-select>
        </el-form-item>
      </template>
    </conditional-filter>
    <div class="table-container">
      <el-table
        ref="dictDataTable"
        :data="list"
        style="width: 100%;"
        size="mini"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="字典编码" align="center" prop="dict_code" v-if="columns[0].visible"></el-table-column>
        <el-table-column label="字典标签" prop="dict_label" align="center" v-if="columns[1].visible"></el-table-column>
        <el-table-column label="字典键值" align="center" prop="dict_value" v-if="columns[2].visible"></el-table-column>
        <el-table-column
          label="字典排序"
          width="140"
          align="center"
          prop="dict_sort"
          v-if="columns[3].visible"
        ></el-table-column>
        <el-table-column label="状态" width="140" align="center" v-if="columns[4].visible">
          <template slot-scope="scope">{{scope.row.status | status}}</template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" v-if="columns[5].visible"></el-table-column>
        <el-table-column
          label="创建时间"
          width="180"
          prop="created_at"
          align="center"
          v-if="columns[6].visible"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="handleDelete(scope.$index, scope.row)"
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

    <!-- 添加/修改字典数据 -->
    <dict-data-detail ref="dictDataDetail" :dictDataDetailDialogData="dictDataDetailDialogData"></dict-data-detail>
  </div>
</template>
<script>
import {
  dictDataList,
  deleteDictData,
} from '@/api/setting/system_module/dictData'
import {
  dictTypeList,
  editDictType,
} from '@/api/setting/system_module/dictType'
import { formatDate } from '@/utils/date'
import dictDataDetail from './components/dictDataDetail'
const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
  dict_label: '',
  dict_type: '',
  status: '',
}
export default {
  name: 'Api:setting/system_module/dict_type/list-index',
  components: {
    dictDataDetail,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      defaultListQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: 0,
      columns: [
        { key: 0, field: 'dict_code', label: `字典编码`, visible: true },
        { key: 1, field: 'dict_label', label: `字典标签`, visible: true },
        { key: 2, field: 'dict_value', label: `字典键值`, visible: true },
        { key: 3, field: 'dict_sort', label: `字典排序`, visible: true },
        { key: 4, field: 'status', label: `状态`, visible: true },
        { key: 5, field: 'remark', label: `备注`, visible: true },
        { key: 5, field: 'created_at', label: `创建时间`, visible: true },
      ],
      dataTypeList: [],
      multipleSelection: [],
      dictDataDetailDialogData: {
        dictDataDetailDialogVisible: false,
        dictDataDetailTitle: '',
        isEdit: false,
        dictType: '',
      },
    }
  },
  created() {
    const dictId = this.$route.params && this.$route.params.dict_id
    editDictType(dictId).then((response) => {
      if (response.code == 200) {
        this.listQuery.dict_type = response.data.list.dict_type
        this.getList()
        this.getDataTypeList()
      }
    })
  },
  filters: {
    formatLoginTime(time) {
      let date = new Date(time * 1000)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    status(status) {
      if (status == 0) return '禁用'
      if (status == 1) return '启用'
    },
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleAdd() {
      this.dictDataDetailDialogData.dictDataDetailDialogVisible = true
      this.dictDataDetailDialogData.dictDataDetailTitle = '添加字典数据'
      this.dictDataDetailDialogData.isEdit = false
      this.dictDataDetailDialogData.dictType = this.listQuery.dict_type
      this.$refs['dictDataDetail'].getDictTypeInfo()
    },
    handleEdit(index, row) {
      this.dictDataDetailDialogData.dictDataDetailDialogVisible = true
      this.dictDataDetailDialogData.dictDataDetailTitle =
        '修改 "' + row.dict_label + '" 字典数据'
      this.dictDataDetailDialogData.isEdit = true
      this.dictDataDetailDialogData.dict_code = row.dict_code
      this.$refs['dictDataDetail'].getDictTypeInfo()
    },
    handleDelete(index, row) {
      this.deleteDictData(row.dict_code)
    },
    handleBatchDelete() {
      let id_arr = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        id_arr.push(this.multipleSelection[i].dict_code)
      }
      this.deleteDictData(id_arr, true)
    },
    getList() {
      dictDataList(this.listQuery).then((response) => {
        if (response.code == 200) {
          this.total = response.data.total
          this.list = response.data.list
        }
      })
    },
    getDataTypeList() {
      dictTypeList().then((response) => {
        if (response.code == 200) {
          this.dictTypeList = response.data.list
          this.$forceUpdate()
        }
      })
    },
    deleteDictData(id, isBatch = false) {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (isBatch) {
          deleteDictData(0, { id: id }).then((response) => {
            if (response.code == 200) {
              this.multipleSelection = []
              this.getList()
            }
          })
        } else {
          deleteDictData(id).then((response) => {
            if (response.code == 200) {
              this.multipleSelection = []
              this.getList()
            }
          })
        }
      })
    },
  },
}
</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>
