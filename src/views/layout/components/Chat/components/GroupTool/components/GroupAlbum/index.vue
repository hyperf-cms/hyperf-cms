<template>
  <el-dialog
    :title="groupTool.contact.displayName"
    :visible.sync="groupTool.groupAlbumDialogVisible"
    width="50%"
    append-to-body
  >
    <div class="filter-container">
      <el-input
        style="margin-bottom:10px; width:60%"
        size="medium"
        placeholder="输入关键字进行过滤"
        v-model="listQuery.file_name"
      ></el-input>
      <el-date-picker
        style="margin-bottom:10px; width:35%"
        size="medium"
        v-model="listQuery.date"
        type="date"
        placeholder="选择日期"
        value-format="timestamp"
      ></el-date-picker>
    </div>
    <div style="height:600px">
      <el-col :span="6" v-for="(item, index) in list" :key="index">
        <el-card :body-style="{ padding: '0px', border_radius: '50%' }">
          <img :src="item.content" style="height:200px;min-width: 250px;max-width:100%" />
          <div style="padding: 14px;">
            <span>好吃的汉堡</span>
            <img :src="item.get_from_user.avatar" alt style="width:40px;height:40px" />
          </div>
        </el-card>
      </el-col>
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
import { groupAlbum } from '@/api/laboratory/chat_module/group'
import { download } from '@/utils/file'
const defaultListQuery = {
  date: '',
  file_name: '',
  cur_page: 1,
  page_size: 20,
  contact_id: '',
}
export default {
  name: 'GroupAlbum',
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
      groupAlbum(this.listQuery).then((response) => {
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    downLoad(data) {
      console.log(data)
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
 