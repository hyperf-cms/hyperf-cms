<template>
  <div class="chatMain">
    <lemon-imui
      ref="IMUI"
      class="lemon"
      width="1000px"
      height="750px"
      :user="user"
      @pull-messages="handlePullMessages"
      @send="handleSend"
    />
  </div>
</template>
<script>
import { initUserInfo } from '@/api/laboratory/chat_module/chat'
export default {
  name: 'Api:laboratory/chat_module/chat_online-chatOnline',
  data() {
    return {
      user: {},
      userList: [
        {
          id: 1,
          displayName: 'ceshi',
          avatar: 'ceshi',
        },
      ],
    }
  },
  created() {
    //初始化当前用户
    initUserInfo().then((response) => {
      this.user = response.data.user
    })
  },
  mounted() {
    const { IMUI } = this.$refs
    //初始化表情包。
    // IMUI.initEmoji(...);
    //从后端请求联系人数据，包装成下面的样子
    const contacts = [
      {
        id: 2,
        displayName: '丽安娜',
        avatar:
          'https://hyperf-cms.oss-cn-guangzhou.aliyuncs.com/admin_face/b416daa93909f0b237aa970434971f4c.jpg',
        index: 'L',
        unread: 0,
        //最近一条消息的内容，如果值为空，不会出现在“聊天”列表里面。
        //lastContentRender 函数会将 file 消息转换为 '[文件]', image 消息转换为 '[图片]'，对 text 会将文字里的表情标识替换为img标签,
        lastContent: IMUI.lastContentRender({
          type: 'text',
          content: '你在干嘛呢？',
        }),
        //最近一条消息的发送时间
        lastSendTime: 1566047865417,
      },
      {
        id: 3,
        displayName: '丽安娜123',
        avatar: '',
        index: 'L',
        unread: 0,
        //最近一条消息的内容，如果值为空，不会出现在“聊天”列表里面。
        //lastContentRender 函数会将 file 消息转换为 '[文件]', image 消息转换为 '[图片]'，对 text 会将文字里的表情标识替换为img标签,
        lastContent: IMUI.lastContentRender({
          type: 'text',
          content: '你在干嘛呢？',
        }),
        //最近一条消息的发送时间
        lastSendTime: 1566047865417,
      },
    ]
    IMUI.initContacts(contacts)
  },
  methods: {
    handlePullMessages(contact, next) {
      //从后端请求消息数据，包装成下面的样子
      const messages = [
        {
          // id: '唯一消息ID',
          // status: 'succeed',
          // type: 'text',
          // sendTime: 1566047865417,
          // content: '你什么才能对接完？',
          // toContactId: contact.id,
          // fromUser: this.user,
        },
      ]
      //将第二个参数设为true，表示已到末尾，聊天窗口顶部会显示“暂无更多消息”，不然会一直转圈。
      next(messages, true)
    },
    handleSend(message, next, file) {
      //调用你的消息发送业务接口

      //执行到next消息会停止转圈，如果接口调用失败，可以修改消息的状态 next({status:'failed'});
      next()
    },
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.lemon {
  position: relative;
  left: 22%;
}
</style>  