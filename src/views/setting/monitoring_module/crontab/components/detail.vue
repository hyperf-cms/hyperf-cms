<template>
  <el-dialog
    :title="timedTaskDetailDialogData.timedTaskDetailTitle"
    :visible.sync="timedTaskDetailDialogData.timedTaskDetailDialogVisible"
    width="700px"
    :close-on-click-modal="false"
  >
    <el-form :model="timedTask" :rules="rules" ref="timedTaskForm" label-width="120px">
      <el-form-item label="任务名称：" prop="name">
        <el-input
          v-model="timedTask.name"
          auto-complete="off"
          size="medium"
          placeholder="请填写任务名称"
          style="width:500px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="Task名称：" prop="task">
        <el-input
          v-model="timedTask.task"
          auto-complete="off"
          size="medium"
          placeholder="请填写Task名称"
          style="width:500px;"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <div slot="label">
          <tip content="左边为字段，右边为对应值" placement="left" />&nbsp;参数：
        </div>
        <div class="dataItem" v-for="(item, index) in timedTask.params" :key="index">
          <el-input v-model="item[0]" style="width:200px" placeholder="请填写字段"></el-input>
          <el-input v-model="item[1]" style="width:200px" placeholder="请填写参数"></el-input>
          <el-button type="text" @click="handleDeleteParamsItem(index)">删除</el-button>
        </div>
        <el-button @click="handleAddParamsItem()" size="small">添加</el-button>
      </el-form-item>
      <el-form-item label="crontab表达式：">
        <el-input
          size="medium"
          v-model="timedTask.execute_time"
          auto-complete="off"
          placeholder="请填写crontab表达式"
        >
          <el-button
            slot="append"
            v-if="!showCronBox"
            icon="el-icon-arrow-up"
            @click="showCronBox= true"
            title="打开图形配置"
          ></el-button>
          <el-button
            slot="append"
            v-else
            icon="el-icon-arrow-down"
            @click="showCronBox= false"
            title="关闭图形配置"
          ></el-button>
        </el-input>
      </el-form-item>
      <el-form-item style="margin-top: -10px; margin-bottom:0px;">
        <span style="color: #E6A23C; font-size: 12px;">corn从左到右（用空格隔开）：秒 分 小时 月份中的日期 月份 星期中的日期 年份</span>
        <crontab v-if="showCronBox" v-model="timedTask.execute_time"></crontab>
      </el-form-item>
      <el-form-item label="任务描述：" prop="desc">
        <el-input
          v-model="timedTask.desc"
          auto-complete="off"
          size="medium"
          placeholder="请填写任务描述"
          type="textarea"
          :rows="5"
        ></el-input>
      </el-form-item>
      <el-form-item label="启动状态：" prop="status">
        <el-radio
          v-model="timedTask.status"
          v-for="dict in timedTaskDetailDialogData.statusOptions"
          :key="dict.dict_value"
          :label="dict.dict_value"
        >{{ dict.dict_label}}</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit('timedTaskForm')">提交</el-button>
      <el-button v-if="!timedTaskDetailDialogData.isEdit" @click="resetForm('timedTaskForm')">重置</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  createTimedTask,
  updateTimedTask,
  editTimedTask,
} from '@/api/setting/monitoring_module/timedTask'
import Crontab from '@/components/crontab'
const defaultTimedTask = {
  name: '',
  params: [],
  task: '',
  status: 1,
  execute_time: '',
  desc: '',
}
export default {
  name: 'TimedTaskDetail',
  components: {
    Crontab,
  },
  props: {
    timedTaskDetailDialogData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      timedTask: Object.assign({}, defaultTimedTask),
      showCronBox: false,
      rules: {
        name: [
          { required: true, message: '请填写任务名称', trigger: 'blur' },
          {
            min: 2,
            max: 60,
            message: '长度在 2 到 60 个字符',
            trigger: 'blur',
          },
        ],
        task: [
          { required: true, message: '请填写Task名称', trigger: 'blur' },
          {
            min: 2,
            max: 60,
            message: '长度在 2 到 60 个字符',
            trigger: 'blur',
          },
        ],
        execute_time: [
          { required: true, message: '请填写crontab表达式', trigger: 'blur' },
          {
            min: 5,
            max: 60,
            message: '长度在 5 到 60 个字符',
            trigger: 'blur',
          },
        ],
        status: [{ required: true, message: '请选择类型', trigger: 'blur' }],
      },
    }
  },
  created() {},
  methods: {
    getTimedTaskInfo() {
      //判断是否为修改
      if (this.timedTaskDetailDialogData.isEdit == true) {
        editTimedTask(this.timedTaskDetailDialogData.id).then((response) => {
          let timedTaskData = response.data.list
          this.timedTask = Object.assign({}, timedTaskData)
        })
      } else {
        this.timedTask = Object.assign({}, defaultTimedTask)
      }
    },
    onSubmit(timedTaskForm) {
      this.$refs[timedTaskForm].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            if (this.timedTaskDetailDialogData.isEdit) {
              updateTimedTask(this.timedTask.id, this.timedTask).then(
                (response) => {
                  this.$refs[timedTaskForm].resetFields()
                  this.$parent.getList()
                  this.timedTaskDetailDialogData.timedTaskDetailDialogVisible = false
                }
              )
            } else {
              createTimedTask(this.timedTask).then((response) => {
                this.$refs[timedTaskForm].resetFields()
                this.timedTask = Object.assign({}, defaultTimedTask)
                this.$parent.getList()
                this.timedTaskDetailDialogData.timedTaskDetailDialogVisible = false
              })
            }
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
    resetForm(timedTaskForm) {
      this.$refs[timedTaskForm].resetFields()
      this.brand = Object.assign({}, defaultTimedTask)
    },
    handleAddParamsItem() {
      this.timedTask.params.push(['', ''])
    },
    handleDeleteParamsItem(index) {
      this.timedTask.params.splice(index, 1)
    },
  },
}
</script>

<style>
</style>
