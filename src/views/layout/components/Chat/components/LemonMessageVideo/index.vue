<script>
import VideoPreview from './components/VideoPreview'
export default {
  //组件的name必须以lemonMessage开头，后面跟上 Message.type
  name: 'LemonMessageVideo',
  inheritAttrs: true,
  //如果需要使用父组件的方法，可以使用注入。
  inject: ['IMUI'],
  components: { VideoPreview },
  render() {
    console.log(this.$attrs)
    //lemon-message-basic 组件对气泡框、头像、事件等信息进行了公共的处理。
    return (
      <lemon-message-basic
        class="lemon-message-video"
        props={{ ...this.$attrs }}
        scopedSlots={{
          content: (props) => {
            //返回HTML结构
            console.log(props)
            return <video-preview content={props.content}></video-preview>
          },
        }}
      />
    )
  },
}
</script>
<style lang="stylus">
.lemon-message.lemon-message-video {
  user-select: none;
  background-color: #fff;

  .lemon-message__content {
    font-size: 12px;
    cursor: pointer;

    &::before {
      display: none;
    }
  }
}
</style>
<style lang="scss" scoped>
.lemon-message-video ::v-deep .lemon-message__content {
  padding: 0px;
  line-height: 0px;
}
</style>