<template> 
  <advice-detail :is-edit='false'></advice-detail>
</template>
<script>
  import AdviceDetail from './components/adviceDetail'
  export default {
    name: 'AddAdvice',
    components: { AdviceDetail }
  }
</script>
<style>
</style>
