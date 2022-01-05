<template>
  <span v-html="content"></span>
</template>
<script>
export default {
  name: 'TextFormat',
  props: {
    content: {
      type: String,
    },
  },
  data() {
    return {}
  },
  methods: {},
  created() {
    var zzreg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g

    this.content = this.content
      .replace(
        zzreg,
        "<a style='border-bottom: 1px solid;color:#3f88bf' href='$1$2' target='_blank'>$1$2</a>"
      )
      .replace(/\n/g, '<br/>')
  },
}
</script>
