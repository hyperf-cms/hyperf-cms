<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-card shadow="never" style="margin: 0 auto;width: 50%;">
        <div slot="header" class="clearfix" style="font-weight: bold;">开关</div>
        <el-form :model="menuConfigData" ref="menuConfigForm" label-width="150px">
          <el-form-item label="维护模式：">
            <el-switch
              v-model="menuConfigData.maintain_switch"
              :active-value="true"
              :inactive-value="false"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeSwitch('maintain_switch', menuConfigData.maintain_switch)"
            ></el-switch>
            <span style="color: #999;">（开启后禁用除超级管理员外所有用户的所有权限）</span>
          </el-form-item>
          <el-form-item label="简易维护模式：">
            <el-switch
              v-model="menuConfigData.simple_maintain_switch"
              :active-value="true"
              :inactive-value="false"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeSwitch('simple_maintain_switch', menuConfigData.simple_maintain_switch)"
            ></el-switch>
            <span style="color: #999;">（开启后禁用除超级管理员外所有用户的增删改权限）</span>
          </el-form-item>
          <el-form-item label="后台注册入口：">
            <el-switch
              v-model="menuConfigData.register_switch"
              :active-value="true"
              :inactive-value="false"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeSwitch('register_switch', menuConfigData.register_switch)"
            ></el-switch>
            <span style="color: #999;">（是否开启后台登录页的注册入口）</span>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card shadow="never" style="margin: 20px auto 0;width: 50%;">
        <div slot="header" class="clearfix" style="font-weight: bold;">操作</div>
        <el-form ref="buttonForm" label-width="150px">
          <el-form-item label="清理Excel文件：">
            <el-button type="danger" plain @click="handleClearExcel()" size="small">执行</el-button>
            <span style="color: #999;">（清理/runtime/excel/下的导出文件）</span>
          </el-form-item>
          <el-form-item label="清理Sql文件：">
            <el-button type="danger" plain @click="handleClearSql()" size="small">执行</el-button>
            <span style="color: #999;">（清理/runtime/sql/下的导出文件）</span>
          </el-form-item>
          <el-form-item label="清理Temp文件：">
            <el-button type="danger" plain @click="handleClearSql()" size="small">执行</el-button>
            <span style="color: #999;">（清理/runtime/temp/下的文件）</span>
          </el-form-item>
          <el-form-item label="备份日志：">
            <el-button type="primary" plain @click="handleBackupLog()" size="small">执行</el-button>
            <el-button type="info" plain @click="handleCheckBackupLog()" size="small">查看备份列表</el-button>
          </el-form-item>
          <el-form-item label="清理日志文件：">
            <el-button type="danger" plain @click="handleClearLog()" size="small">执行</el-button>
            <span style="color: #999;">（清理日志系统中的导出文件）</span>
          </el-form-item>
        </el-form>
      </el-card>
    </el-card>
    <!-- 日志备份列表 -->
    <el-dialog
      title="日志备份列表"
      :visible.sync="backupListDialog"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-button
        type="danger"
        size="mini"
        @click="handleClearBackupLog"
        style="margin-bottom: 15px;"
      >清除所有文件</el-button>
      <el-table ref="backupLogTable" size="mini" :data="backupList" style="width: 100%;" border>
        <el-table-column label="文件名称">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleDownloadBackupLog(scope.row.url)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  getControlList,
  changeControl,
} from '@/api/setting/system_module/control'
const defaultMenuConfigData = {
  maintain_switch: null,
  simple_maintain_switch: null,
  register_switch: null,
}
export default {
  data() {
    return {
      menuConfigData: Object.assign({}, defaultMenuConfigData),
      menuConfigList: [],
      backupListDialog: false,
      backupList: [],
    }
  },
  created() {
    this.getConfigList()
  },
  methods: {
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否要提交修改?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            updateOrderSetting(1, this.orderSetting).then((response) => {
              if (response.code == 200) {
                this.$message({
                  type: 'success',
                  message: '提交成功!',
                  duration: 1000,
                })
              }
            })
          })
        } else {
          this.$message({
            message: '提交参数不合法',
            type: 'warning',
          })
          return false
        }
      })
    },
    getConfigList() {
      getControlList().then((response) => {
        if (response.code == 200) {
          this.$nextTick(() => {
            this.menuConfigData = response.data.list
          })
        }
      })
    },
    changeSwitch(name, status) {
      // 开关切换事件
      this.$confirm('确认执行该操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          changeControl({ key: name, value: status })
            .then((response) => {
              if (response.code != 200) {
                this.menuConfigData[name] = !status
              }
            })
            .catch((err) => {
              this.menuConfigData[name] = !status
            })
        })
        .catch((err) => {
          this.menuConfigData[name] = !status
        })
    },
    handleClearExcel() {
      // 清理excel文件
      this.$confirm('确认清理excel文件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.msgError('该功能未开放')
          // clearExcel()
        })
        .catch((err) => {})
    },
    handleClearSql() {
      // 清理sql文件
      this.$confirm('确认清理sql文件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.msgError('该功能未开放')
          // clearSql()
        })
        .catch((err) => {})
    },
    handleConfigRebulid() {
      this.$confirm('是否要生成配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.msgError('该功能未开放')
          // configCreate({ type: 'rebuild' }).then((response) => {})
        })
        .catch((err) => {})
    },
    handleBackupLog() {
      this.$confirm('是否备份所有日志?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.msgError('该功能未开放')
          // backupLog().then((response) => {})
        })
        .catch((err) => {})
    },
    handleCheckBackupLog() {
      this.backupListDialog = true
      getBackupLog().then((response) => {
        if (response.code == 200) {
          this.backupList = response.data.list
        }
      })
    },
    handleClearBackupLog() {
      this.$confirm('确认清理日志备份文件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.msgError('该功能未开放')
          // clearBackupLog().then((response) => {
          //   if (response.errorCode == 200) {
          //     this.backupListDialog = false
          //   }
          // })
        })
        .catch((err) => {})
    },
    handleClearLog() {
      this.$confirm('确认清理日志系统中的文件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.msgError('该功能未开放')
          // clearLog()
        })
        .catch((err) => {})
    },
    handleDownloadBackupLog(url) {
      window.open(url, '_blank')
    },
  },
}
</script>