<template>
  <el-dialog
    :title="groupTool.contact.displayName"
    :visible.sync="groupTool.groupAlbumDialogVisible"
    :close-on-press-escape="false"
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
    <div style="height:600px;overflow-y:auto;">
      <el-col :span="6" v-for="(item, index) in list" :key="index" style="margin-bottom:30px">
        <el-card :body-style="{ padding: '0px' }" style="border-radius:12px">
          <div class="demo-image__placeholder">
            <div class="block">
              <el-image
                :src="item.content"
                fit="fill"
                style="width: 250px; height: 230px"
                :preview-src-list="srcList"
                z-index="2100"
              >
                <div slot="placeholder" class="image-slot">
                  加载中
                  <span class="dot">...</span>
                </div>
              </el-image>
            </div>
          </div>
          <div style="padding: 8px;display: flex;justify-content:space-between">
            <img
              :src="item.get_from_user.avatar"
              alt
              style="width:40px;height:40px;border-radius:10%"
            />
            <span style="line-height:40px;">{{ parseTime(item.send_time / 1000)}}</span>
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
      srcList: [],
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
        this.srcList = response.data.srcList
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
 