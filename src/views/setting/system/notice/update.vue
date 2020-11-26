<template> 
  <notice-detail :is-edit='true'></notice-detail>
</template>
<script>
  import NoticeDetail from './components/noticeDetail'
  export default {
    name: 'UpdateNotice',
    components: { NoticeDetail }
  }
</script>
<style>
</style>