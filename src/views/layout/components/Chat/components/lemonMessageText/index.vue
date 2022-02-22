<script>
import TextFormat from './components/TextFormat'
export default {
  //组件的name必须以lemonMessage开头，后面跟上 Message.type
  name: 'lemonMessageText',
  inheritAttrs: true,
  //如果需要使用父组件的方法，可以使用注入。
  inject: ['IMUI'],
  components: { TextFormat },
  render() {
    //lemon-message-basic 组件对气泡框、头像、事件等信息进行了公共的处理。
    return (
      <lemon-message-basic
        class="lemon-message-text"
        props={{ ...this.$attrs }}
        scopedSlots={{
          content: (props) => {
            const content = this.IMUI.emojiNameToImage(props.content)
            return <text-format content={content}></text-format>
          },
        }}
      />
    )
  },
}
</script>
<style lang="stylus" >