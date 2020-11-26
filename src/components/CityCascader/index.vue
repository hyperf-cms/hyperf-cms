<template>
  <div>
    <el-form-item label="地域类型:">
      <el-radio-group @change="changeDistrict" v-model="district">
        <el-radio label='NONE' border>不限</el-radio>
        <el-radio label='CITY' border>按省市</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="选择省市:" v-if="district == 'CITY'">
      <el-cascader v-model="city" :options="options" :props="props" collapse-tags clearable filterable @change="changeCity" @focus="init"></el-cascader>
    </el-form-item>
     <el-form-item label="受众位置类型:" v-if="district == 'CITY'">
      <el-radio-group v-model="location_type" @change="changeLocationType">
        <el-radio label='HOME' border>居住在该地区的用户</el-radio>
        <el-radio label='TRAVEL' border>到该地区旅行的用户</el-radio>
        <el-radio label='ALL' border>该地区内的所有用户</el-radio>
        <el-radio label='CURRENT' border>正在该地区的用户</el-radio>
      </el-radio-group>
    </el-form-item>
  </div>
</template>
<script>
export default {
  name: 'CityCascader',
  props: {
    // 默认文件名
    city: {
      default: []
    },
    district: {
      default: ''
    },
    location_type: {
      default: 'HOME'
    }
  },
  created() {
    this.init();
  },
  data() {
    return {
      props: { multiple: true, value: 'id', label: 'name' },
      cityJsonValue: '',
      cityJson: '',
      options: {},
    }
  },
  methods: {
    init() {
      let cityJson = require('../../assets/json/ToutiaoCity.json')
      this.cityJson = cityJson
      this.cityJsonValue = Object.values(cityJson)
      this.dealCity();
    },
    changeCity($event) {
      this.$emit('update:city', $event)
    },
     changeLocationType($event) {
      this.$emit('update:location_type', $event)
    },
    changeDistrict($event) {
      if ($event == 'CITY') {
        let cityJson = require('../../assets/json/ToutiaoCity.json')
        this.cityJson = cityJson
        this.cityJsonValue = Object.values(cityJson)
        this.dealCity();
      }
      this.$emit('update:district', $event)
    },
    dealCity() {
      let option = [];
      for (var i = 0; i < this.cityJsonValue.length; i++) {
        if (this.cityJsonValue[i].parent == 0) {
          option.push(this.cityJsonValue[i])
        }
      }
      for (var i = 0; i < option.length; i++) {
        if ("children" in option[i]) {
          for (var j = 0; j < option[i].children.length; j++) {
            if (this.cityJson[option[i].children[j]] != undefined) {
              if (this.cityJson[option[i].children[j]].level != 3) {
                option[i].children[j] = this.cityJson[option[i].children[j]]
                delete option[i].children[j].children
              } else {
                delete option[i].children
                break;
              }
            }

          }
        }

      }
      this.options = option
    },
  },
}

</script>
<style scoped>
</style>
