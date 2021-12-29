<script>
export default {
  //组件的name必须以lemonMessage开头，后面跟上 Message.type
  name: 'LemonMessageLink',
  inheritAttrs: true,
  //如果需要使用父组件的方法，可以使用注入。
  inject: ['IMUI'],
  components: {},
  render() {
    //lemon-message-basic 组件对气泡框、头像、事件等信息进行了公共的处理。
    return (
      <lemon-message-basic
        class="lemon-message-link"
        props={{ ...this.$attrs }}
        scopedSlots={{
          content: (props) => {
            //返回HTML结构
            return (
              <a class="linkClass" href={props.content} target="_blank">
                {props.content}
              </a>
            )
          },
        }}
      />
    )
  },
}
</script>
<style lang="stylus">
.lemon-message.lemon-message-link {
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
.lemon-message-link ::v-deep .lemon-message__content {
  border-bottom: 1px solid #fff;
}
.lemon-message-link ::v-deep .lemon-message__content .linkClass {
  border-bottom: 1px solid;
  font-size: 14px;
}
</style>