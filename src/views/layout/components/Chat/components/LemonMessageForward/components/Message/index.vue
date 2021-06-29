<template>
  <div>
    <div class="forward-message" @click="catForwardRecords">
      <div class="title">{{ title }}</div>
      <div v-for="(message, index) in content.message" :key="index" class="lists">
        <p v-if="index < 2">
          <span>{{ message.fromUser.displayName }}：</span>
          <span v-if="message.type == 'text'">{{ message.content }}</span>
          <span v-if="message.type == 'file'">【文件消息】</span>
          <span v-if="message.type == 'image'">【图片消息】</span>
          <span v-if="message.type == 'video'">【视频消息】</span>
        </p>
      </div>
      <div class="footer">
        <span>转发：聊天会话记录 ({{ content.total }}条)</span>
      </div>
    </div>
    <!-- 会话记录查看器 -->
    <forward-record ref="forwardRecordsRef" />
  </div>
</template>
<script>
import ForwardRecord from '../ForwardRecord'
export default {
  name: 'Message',
  components: { ForwardRecord },
  props: {
    content: {
      type: String,
    },
  },
  data() {
    return {
      title: '',
      record: [],
      num: 0,
    }
  },
  methods: {
    catForwardRecords() {
      this.$refs.forwardRecordsRef.open(this.content)
    },
    getForwardTitle(list) {
      console.log(list)
      let arr = [...new Set(list.map((v) => v.fromUser.displayName))]
      return arr.join('、') + '的会话记录'
    },
  },
  created() {
    let content = this.content
    this.num = this.content.length
    this.title = this.getForwardTitle(content.message)
  },
}
</script>

<style lang="scss" scoped>
/* 会话记录消息 */
.forward-message {
  width: 250px;
  min-height: 95px;
  max-height: 150px;
  border-radius: 3px;
  background-color: white;
  padding: 3px 10px;
  cursor: pointer;
  box-shadow: 0 0 5px 0px #e8e4e4;
  text-align: left;
  user-select: none;

  .title {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #565353;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 400;
  }

  .lists p {
    height: 18px;
    line-height: 18px;
    font-size: 10px;
    color: #aaa9a9;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 100;
  }

  .footer {
    height: 32px;
    line-height: 35px;
    color: #858282;
    border-top: 1px solid #f1ebeb;
    font-size: 12px;
    margin-top: 12px;
    font-weight: 300;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    box-shadow: 0 0 5px 0px #cac6c6;
  }
}
</style>