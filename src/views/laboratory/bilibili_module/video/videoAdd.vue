<template>
  <el-card class="form-container" shadow="never" style="width: 1000px">
    <el-form :model="video" :rules="rules" ref="videoForm" label-width="120px">
      <el-form-item label="视频链接信息：">
        <div class="dataItem" v-for="(item, index) in video.video_info" :key="index">
          <el-input v-model="item.video_url" placeholder="请填写视频链接：" style="width:70%"></el-input>
          <el-select v-model="item.timed_status" placeholder="请选择是否开启定时统计" style="width:30%">
            <el-option
              v-for="item in timedStatusOptions"
              :key="item.dict_value"
              :label="item.dict_label"
              :value="item.dict_value"
            ></el-option>
          </el-select>
          <el-button type="text" @click="handleDeleteDataItem(index)">删除</el-button>
        </div>
        <el-button @click="handleAddDataItem()" size="small">添加</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('videoForm')">提交</el-button>
        <el-button @click="resetForm('videoForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { videoAdd } from '@/api/laboratory/bilibili_module/video'
const defaultvideo = {
  video_info: [
    {
      video_url: '',
      timed_status: '',
    },
  ],
}
export default {
  name: 'FileMaterialDetail',
  data() {
    return {
      video: Object.assign({}, defaultvideo),
      timedStatusOptions: [],
    }
  },
  created() {
    this.getDicts('lab_video_time_status').then((response) => {
      if (response.code == 200) {
        this.timedStatusOptions = response.data.list
      }
    })
  },
  methods: {
    onSubmit(videoForm) {
      this.$refs[videoForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            videoAdd(this.video).then((response) => {
              this.resetForm(videoForm)
            })
          })
        } else {
          this.$message({
            message: '验证失败',
            type: 'error',
            duration: 1000,
          })
          return false
        }
      })
    },
    resetForm(videoForm) {
      this.video.video_info = [
        {
          video_url: '',
          timed_status: 1,
        },
      ]
    },
    handleDeleteDataItem(index) {
      this.video.video_info.splice(index, 1)
    },
    handleAddDataItem() {
      if (this.video.video_info.length >= 50) {
        this.msgError('最多一次性添加50条视频链接')
      }
      this.video.video_info.push({
        video_url: '',
        timed_status: 1,
      })
    },
  },
}
</script>
<style>
.dataItem {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.dataItem >>> .el-input {
  width: 45%;
}
</style>
