<el-dialog title="详细内容" :visible.sync="viewAdviceDialog">
      <el-card class="box-card" shadow="never">
        <h3 v-html="viewContent.title"></h3>
        <div v-html="viewContent.content" class="box-content"></div>
      </el-card>
      <el-card class="box-card reply-box" shadow="never" v-if="viewContent.reply">
        <h3>管理员回复：</h3>
        <div v-html="viewContent.reply" class="box-content"></div>
      </el-card>
    </el-dialog>