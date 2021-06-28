<template>
  <div>
    <div class="forward-message" @click="catForwardRecords">
      <div class="title">{{ content.fromUser.displayName }}的会话记录</div>
      <div v-for="(message, index) in content.message" :key="index" class="lists">
        <p>
          <span>{{ message.fromUser.displayName }}：</span>
          <span>{{ message.content }}</span>
        </p>
      </div>
      <div class="footer">
        <span>转发：聊天会话记录 ({{ content.total }}条)</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Message',
  components: {},
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
      console.log(this.content)
      // this.$refs.forwardRecordsRef.open(this.record_id)
    },
    getForwardTitle(list) {
      let arr = [...new Set(list.map((v) => v.nickname))]
      return arr.join('、') + '的会话记录'
    },
  },
  created() {
    let content = this.content

    this.num = this.content.length
    // this.records = forward.list
    // this.title = this.getForwardTitle(this.records)
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