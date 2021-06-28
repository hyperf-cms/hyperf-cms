<script>
import Message from './components/Message'
export default {
  //组件的name必须以lemonMessage开头，后面跟上 Message.type
  name: 'LemonMessageForward',
  inheritAttrs: false,
  //如果需要使用父组件的方法，可以使用注入。
  inject: ['IMUI'],
  components: {
    Message,
  },
  render() {
    //lemon-message-basic 组件对气泡框、头像、事件等信息进行了公共的处理。
    return (
      <lemon-message-basic
        class="lemon-message-forward"
        props={{ ...this.$attrs }}
        scopedSlots={{
          content: (props) => {
            //返回HTML结构
            return <message content={props.content}></message>
          },
        }}
      />
    )
  },
}
</script>

<style lang="stylus">
.lemon-message.lemon-message-forward {
  user-select: none;

  .lemon-message__content {
    border: 2px solid #000;
    font-size: 12px;
    cursor: pointer;

    &::before {
      display: none;
    }
  }
}
</style>