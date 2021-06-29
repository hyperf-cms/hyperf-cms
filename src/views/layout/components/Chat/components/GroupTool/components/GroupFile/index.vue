<template>
  <el-dialog
    :title="groupTool.contact.displayName"
    :visible.sync="groupTool.groupFileDialogVisible"
    width="35%"
    append-to-body
  >
    <div class="filter-container">
      <el-input
        prefix-icon="el-icon-search"
        style="margin-bottom:10px; width:60%"
        size="medium"
        placeholder="输入关键字进行过滤"
        v-model="listQuery.file_name"
      ></el-input>
      <el-date-picker
        suffix-icon="el-icon-date"
        size="medium"
        v-model="listQuery.date"
        type="date"
        placeholder="选择日期"
        value-format="timestamp"
      ></el-date-picker>
    </div>
    <div>
      <el-table style="width: 100%" size="medium" :data="list" height="500">
        <el-table-column property="file_name" label="文件" width="250" show-overflow-tooltip="true">
          <template slot-scope="scope">
            <svg-icon
              v-if="['ppt', 'word', 'excel', 'txt', 'md', 'mp4', 'mp3', 'apk', 'exe'].indexOf(scope.row.file_ext) != -1"
              :icon-class="scope.row.file_ext + '-color'"
              style="width:2.0em;height:2.0em;vertical-align: middle;margin-right:5px;"
            ></svg-icon>
            <svg-icon
              v-else
              icon-class="unknow_file"
              style="width:2.0em;height:2.0em;vertical-align: middle;margin-right:5px;"
            ></svg-icon>
            <span style="font-size:14px">{{ scope.row.file_name}}</span>
          </template>
        </el-table-column>
        <el-table-column property="send_time" label="发送时间" width="150">
          <template slot-scope="scope">{{ parseTime(scope.row.send_time / 1000)}}</template>
        </el-table-column>
        <el-table-column property="file_size" label="大小" width="80">
          <template slot-scope="scope">{{ getfilesize(scope.row.file_size)}}</template>
        </el-table-column>
        <el-table-column label="发送人" width="120">
          <template slot-scope="scope">{{ scope.row.get_from_user.desc}}</template>
        </el-table-column>
        <el-table-column property="address" label>
          <template slot-scope="scope">
            <svg-icon icon-class="download" class="icon" @click="downLoad(scope.row)"></svg-icon>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer" style="height:50px">
      <Pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.cur_page"
        :limit.sync="listQuery.page_size"
        @pagination="getList"
      ></Pagination>
    </div>
  </el-dialog>
</template>
<script>
import { groupFile } from '@/api/laboratory/chat_module/group'
import { download } from '@/utils/file'
const defaultListQuery = {
  date: '',
  file_name: '',
  cur_page: 1,
  page_size: 20,
  contact_id: '',
}
export default {
  name: 'GroupFile',
  components: {},
  props: {
    groupTool: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: 0,
    }
  },
  mounted() {},
  watch: {
    'listQuery.date'(val) {
      this.getList()
    },
    'listQuery.file_name'(val) {
      this.getList()
    },
  },
  created() {},
  methods: {
    init() {
      this.getList()
    },
    getList() {
      this.listQuery.contact_id = this.groupTool.contact.id
      groupFile(this.listQuery).then((response) => {
        if (response.code == 200) {
          this.list = response.data.list
          this.total = response.data.total
        }
      })
    },
    downLoad(data) {
      const fileExtension = data.content.substring(
        data.content.lastIndexOf('.') + 1
      )
      download(data.content, data.file_name, fileExtension, true)
    },
  },
}
</script>
<style lang="scss" scoped>
.icon {
  width: 1.8em;
  height: 1.8em;
  cursor: pointer;
  &:hover {
    color: #000;
    border-color: #333;
  }
}
</style>
 