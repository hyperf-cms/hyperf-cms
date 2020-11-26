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
        swaggerApi: process.env.BASE_API + '/logs',
    }
  }
}
</script>