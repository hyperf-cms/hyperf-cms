<template>
  <el-dialog
    :title="groupTool.contact.displayName"
    :visible.sync="groupTool.groupEditDialogVisible"
    :append-to-body="true"
    destroy-on-close
    width="45%"
    @close="closeDialog"
  >
    <el-form :model="group" :rules="rules" ref="groupForm" label-width="150px">
      <el-form-item label="群ID:">
        <el-input v-model="group.group_id" disabled></el-input>
      </el-form-item>
      <el-form-item label="群名称:" prop="group_name">
        <el-input v-model="group.group_name" placeholder="请填写群名称"></el-input>
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
      <el-form-item label="群介绍：">
        <tinymce
          v-if="groupTool.groupEditDialogVisible"
          :height="300"
          ref="introductionRef"
          id="tinymce"
          v-model="group.introduction"
        ></tinymce>
      </el-form-item>
      <el-form-item label="群验证：" prop="validation">
        <el-radio-group v-model="group.validation">
          <el-radio :label="0">不需要</el-radio>
          <el-radio :label="1">需要</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="群头像：">
        <single-upload v-model="group.avatar" savePath="chat/group/avatar"></single-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit('groupForm')">提交</el-button>
      <el-button @click="resetForm('groupForm')">重置</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Tinymce from '@/components/Tinymce'
import SingleUpload from '@/components/Upload/singleUpload'
const defaultGroup = {
  group_id: '',
  group_name: '',
  avatar: '',
  size: '',
  introduction: '',
  validation: '',
}
export default {
  name: 'GroupEdit',
  components: { Tinymce, SingleUpload },
  props: {
    groupTool: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      group: Object.assign({}, defaultGroup),
      rules: {
        group_name: [
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
    init() {
      this.group.group_id = this.groupTool.contact.id
      this.group.group_name = this.groupTool.contact.displayName
      this.group.avatar = this.groupTool.contact.avatar
      this.group.size = this.groupTool.contact.size
      this.group.validation = this.groupTool.contact.validation
      this.group.introduction = this.groupTool.contact.introduction
      this.$nextTick(function () {
        this.$refs.introductionRef.setContent(
          this.groupTool.contact.introduction
        )
      })
    },
    onSubmit(groupForm) {
      this.$refs[groupForm].validate((valid) => {
        if (!valid) {
          this.$message({
            message: '验证失败',
            type: 'error',
            duration: 1000,
          })
          return false
        } else {
          this.$parent.$parent.$parent.sendEditGroup(this.group)
          this.groupTool.groupEditDialogVisible = false
        }
      })
    },
    closeDialog() {
      this.$refs.introductionRef.setContent('')
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
 