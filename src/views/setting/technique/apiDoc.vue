<template>
  <elFrame :src="swaggerApi" />
</template>
<script>
import elFrame from '@/components/Iframe/index'
export default {
  name: 'Swagger',
  components: { elFrame },
  data() {
    return {
        swaggerApi: 'http://trackingdoc.admin.suyougame.com/web/#/1',
    }
  },
  created() {
  	window.open(this.swaggerApi)
  }
}
</script>