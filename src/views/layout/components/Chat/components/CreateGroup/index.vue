<template>
  <el-dialog
    title="添加群聊"
    :visible.sync="createGroupDialogData.visible"
    width="800px"
    :close-on-click-modal="false"
    :append-to-body="true"
    class="field-dialog"
  >
    <el-steps :active="active" simple>
      <el-step title="填写信息" icon="el-icon-edit"></el-step>
      <el-step title="上传头像" icon="el-icon-upload"></el-step>
      <el-step title="邀请成员" icon="el-icon-user"></el-step>
    </el-steps>
    <div v-if="active == 0" style="margin-top:40px">
      <el-form :model="group" ref="groupForm" :rules="rules" label-width="180px">
        <el-form-item label="群名称：" prop="name">
          <el-input
            v-model="group.name"
            auto-complete="off"
            size="medium"
            placeholder="请填写群名称"
            style="width:450px"
          ></el-input>
        </el-form-item>
        <el-form-item label="群规模：" prop="size">
          <el-radio-group v-model="group.size">
            <el-radio :label="200">200人</el-radio>
            <el-radio :label="500">500人</el-radio>
            <el-radio :label="1000">1000人</el-radio>
            <el-radio :label="1500">1500人</el-radio>
            <el-radio :label="2000">2000人</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="群介绍：" prop="introduction">
          <el-input
            v-model="group.introduction"
            auto-complete="off"
            type="textarea"
            size="medium"
            :rows="4"
            placeholder="请填写群介绍"
            style="width:450px"
          ></el-input>
        </el-form-item>
        <el-form-item label="群验证：" prop="validation">
          <el-radio-group v-model="group.validation">
            <el-radio :label="0">不需要</el-radio>
            <el-radio :label="1">需要</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="active == 1" style="margin-top:40px">
      <group-avatar :group="group"></group-avatar>
    </div>
    <div v-if="active == 2" style="margin-top:40px">
      <group-invite
        :contacts="createGroupDialogData.contacts"
        :creator="createGroupDialogData.creator"
        :checkedContacts="createGroupDialogData.checkedContacts"
      ></group-invite>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="prev()" :disabled="active == 0 ? true: false">上一步</el-button>
      <el-button size="small" @click="next('groupForm')">下一步</el-button>
    </div>
  </el-dialog>
</template>
<script>
import GroupAvatar from './components/GroupAvatar'
import GroupInvite from './components/GroupInvite'
const defaultGroup = {
  title: '',
  validation: 0,
  content: '',
  size: 200,
  introduction: '',
  avatar: '',
}
export default {
  name: 'CreateGroup',
  components: { GroupAvatar, GroupInvite },
  props: {
    createGroupDialogData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      group: Object.assign({}, defaultGroup),
      active: 0,
      rules: {
        name: [
          { required: true, message: '请填写群名称', trigger: 'blur' },
          {
            min: 2,
            max: 60,
            message: '长度在 2 到 60 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  mounted() {},
  watch: {},
  created() {},
  methods: {
    init() {},
    prev() {
      this.active -= 1
    },
    next(groupForm) {
      if (this.active == 0) {
        this.$refs[groupForm].validate((valid) => {
          if (!valid) {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000,
            })
            return false
          } else {
            this.active += 1
          }
        })
      } else {
        this.active += 1
      }
    },
  },
}
</script>
<style lang="scss" scoped>
</style>
 