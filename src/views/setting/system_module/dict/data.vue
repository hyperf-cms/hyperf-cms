<template>
  <div class="app-container">
    <conditional-filter
      :listQuery.sync="listQuery"
      :defaultListQuery="defaultListQuery"
      @getList="getList"
    >
      <template slot="extraForm">
        <el-form-item label="字典名称">
          <el-select v-model="listQuery.dict_type" size="small">
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
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        style="float: right;"
        icon="el-icon-plus"
        type="primary"
        size="mini"
        @click="handleAddDictType"
      >添加字典数据</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="dictDataTable" :data="list" style="width: 100%;" size="mini">
        <el-table-column label="字典编码" align="center">
          <template slot-scope="scope">{{ scope.row.dict_code }}</template>
        </el-table-column>
        <el-table-column label="字典标签" prop="dict_name" align="center">
          <template slot-scope="scope">{{scope.row.dict_label}}</template>
        </el-table-column>
        <el-table-column label="字典键值" align="center">
          <template slot-scope="scope">{{scope.row.dict_value}}</template>
        </el-table-column>
        <el-table-column label="字典排序" width="140" align="center">
          <template slot-scope="scope">{{scope.row.dict_sort}}</template>
        </el-table-column>
        <el-table-column label="状态" width="140" align="center">
          <template slot-scope="scope">{{scope.row.status}}</template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">{{scope.row.remark}}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="180" prop="last_login" align="center">
          <template slot-scope="scope">{{ scope.row.created_at }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="handleEditDictType(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="handleDeleteDictType(scope.$index, scope.row)"
            >删除</el-button>
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
import ConditionalFilter from '@/components/ConditionalFilter'
import dictDataDetail from './components/dictDataDetail'
const defaultListQuery = {
  cur_page: 1,
  page_size: 20,
  dict_label: '',
  dict_type: '',
  status: '',
}
export default {
  name: 'Api:setting/system_module/dict——type/list-index',
  components: {
    ConditionalFilter,
    dictDataDetail,
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      defaultListQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: 0,
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
      this.listQuery.dict_type = response.data.list.dict_type
      this.getList()
      this.getDataTypeList()
    })
  },
  filters: {
    formatLoginTime(time) {
      let date = new Date(time * 1000)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    status(status) {
      if (status == 0) return '停用'
      if (status == 1) return '正常'
    },
  },
  methods: {
    updateView(e) {
      this.$forceUpdate()
    },
    handleAddDictType() {
      this.dictDataDetailDialogData.dictDataDetailDialogVisible = true
      this.dictDataDetailDialogData.dictDataDetailTitle = '添加字典数据'
      this.dictDataDetailDialogData.isEdit = false
      this.dictDataDetailDialogData.dictType = this.listQuery.dict_type
      this.$refs['dictDataDetail'].getDictTypeInfo()
    },
    handleEditDictType(index, row) {
      this.dictDataDetailDialogData.dictDataDetailDialogVisible = true
      this.dictDataDetailDialogData.dictDataDetailTitle =
        '修改 "' + row.dict_label + '" 字典数据'
      this.dictDataDetailDialogData.isEdit = true
      this.dictDataDetailDialogData.dict_code = row.dict_code
      this.$refs['dictDataDetail'].getDictTypeInfo()
    },
    handleDeleteDictType(index, row) {
      this.deleteDictData(row.dict_code)
    },
    handleSizeChange(val) {
      this.listQuery.cur_page = 1
      this.listQuery.page_size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.cur_page = val
      this.getList()
    },
    getList() {
      dictDataList(this.listQuery).then((response) => {
        this.total = response.data.total
        this.list = response.data.list
      })
    },
    getDataTypeList() {
      dictTypeList().then((response) => {
        this.dictTypeList = response.data.list
      })
    },
    deleteDictData(id) {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteDictData(id).then((response) => {
          this.getList()
        })
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
