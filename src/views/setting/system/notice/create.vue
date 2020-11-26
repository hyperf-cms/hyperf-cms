<template> 
  <notice-detail :is-edit='false'></notice-detail>
</template>
<script>
  import NoticeDetail from './components/noticeDetail'
  export default {
    name: 'AddNotice',
    components: { NoticeDetail }
  }
</script>
<style>
</style>
