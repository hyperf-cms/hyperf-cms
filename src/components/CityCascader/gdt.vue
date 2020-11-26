<template>
  <div>
    <el-form-item label="地域类型:">
      <el-radio-group @change="changeDistrict" v-model="district">
        <el-radio label='NONE' border>不限</el-radio>
        <el-radio label='CITY' border>按省市</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="选择省市:" v-if="district == 'CITY'">
      <el-cascader :options="options" :props="props" collapse-tags clearable filterable @change="changeCity" @focus="init" style="width: 100%" />
    </el-form-item>
     <el-form-item label="受众位置类型:" v-if="district == 'CITY'">
      <el-checkbox-group v-model="location_types" @change="changeLocationTypes">
        <el-checkbox label='RECENTLY_IN' border>近期在这里的人&nbsp;<tip :content="tips.recently" placement="top" btnColor="#c4c8cc"></tip></el-checkbox>
        <el-checkbox label='LIVE_IN' border>常住这里的人&nbsp;<tip :content="tips.live" placement="top" btnColor="#c4c8cc"></tip></el-checkbox>
        <el-checkbox label='TRAVEL_IN' border>旅行到这里的人&nbsp;<tip :content="tips.travel" placement="top" btnColor="#c4c8cc"></tip></el-checkbox>
        <el-checkbox label='VISITED_IN' border>去过这里的人&nbsp;<tip :content="tips.visited" placement="top" btnColor="#c4c8cc"></tip></el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </div>
</template>
<script>
import Tip from '@/components/Tip';

export default {
  name: 'GdtCityCascader',
  components: {
    Tip,
  },
  props: {
    // 默认文件名
    city: {
      default: []
    },
    location_types: {
      default: ['RECENTLY_IN'],
    }
  },
  created() {

  },
  data() {
    return {
      props: { multiple: true },
      options: [],
      district: 'NONE',
      tips: {
        recently: '当前或最近1~2天位置在该区域的人。',
        live: '最近一个月居住在该区域的人。',
        travel: '旅游或出差来到该区域的人，并且近一个月常住地不在此。',
        visited: '最近一个月去过这里的人',
      }
    }
  },
  methods: {
    init() {
      let cityJson = require('../../assets/json/GdtCity.json')
      this.options = cityJson;
    },
    changeCity($event) {
      this.$emit('update:city', $event)
    },
    changeLocationTypes($event) {
      this.$emit('update:location_types', $event)
    },
    changeDistrict($event) {
      if ($event == 'CITY') {
        let cityJson = require('../../assets/json/GdtCity.json')
        this.options = cityJson;
      }
      this.district = $event;
    },
  },
}

</script>
<style scoped>
</style>
