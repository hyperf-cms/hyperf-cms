<template>
  <el-image :fit="fit" :src="image_url" :preview-src-list="image_list"></el-image>
</template>

<script>
export default {
  name: 'ImageView',
  props: {
    image_url: {
      type: String,
      default: '',
    },
    image_list: {
      type: Array,
      default: [],
    },
  },
  mounted() {
    document.addEventListener(
      'click',
      (e) => {
        if (e.target.classList.contains('el-image__inner')) {
          let _srcList = this.image_list
          this.$set(this, 'image_list', [])
          this.$nextTick(() => {
            this.$set(this, 'image_list', _srcList)
          })
        }
      },
      false
    )
  },
  data() {
    return {}
  },
  methods: {},
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-image-viewer__wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
