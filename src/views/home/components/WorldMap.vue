<template>
  <div class="echarts">
    <div :style="{height:height,width:width}" ref="myEchart"></div>
  </div>
</template>
<script>
import { getWorldMapData } from '@/api/common/home'
import echarts from 'echarts' //引入组件
import '../../../../node_modules/echarts/map/js/world.js' //引入组件

export default {
  name: 'WorldMap',
  props: {
    width: { type: String, default: '100%' },
    height: { type: String, default: '600px' },
    mapColor: { type: String, default: 1 },
  },
  data() {
    return {
      chart: null,
      data: [],
      nameMap: [],
      color1: [
        '#ccc',
        '#a1c2f0',
        '#90b7ed',
        '#91b8ed',
        '#4386e0',
        '#fdd4d5',
        '#fcb2b5',
        '#fbadb0',
        '#fcb1b4',
      ],
      color2: ['#7CF9D0', '#7CC0FE', '#DEF6FF'],
      color3: ['orangered', 'yellow', 'lightskyblue'],
      color4: ['#e6f7ff', '#1890FF', '#0050b3'],
      color5: ['#f6efa6', '#bf444c', '#da8575'],
    }
  },
  mounted() {
    getWorldMapData().then((response) => {
      this.data = response.data.dataArr
      this.nameMap = response.data.namemap
      this.initChart()
    })
  },
  methods: {
    changeColor(color) {
      this.chart.setOption({
        visualMap: {
          inRange: {
            color: this['color' + color],
          },
        },
      })
    },
    initChart() {
      this.chart = echarts.init(this.$refs.myEchart)
      window.onresize = echarts.init(this.$refs.myEchart).resize
      // 把配置和数据放这里
      this.chart.setOption({
        backgroundColor: '#fff',
        title: {
          //地图显示标题
          text: '全球国家面积图',
          subtext: 'Global logistics quotation channel quantity map',
          sublink: '',
          top: '0px',
          left: 'center',
          textStyle: { color: '#000' },
        },
        visualMap: {
          //图列显示柱
          type: 'continuous',
          min: 0,
          left: 20,
          max: 2000,
          text: ['2000', '0'],
          realtime: true,
          calculable: true,
          showLabel: true,
          inRange: {
            color: this['color' + this.mapColor],
          },
        },
        toolbox: {
          //工具栏
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 50,
          itemGap: 20,
          left: 30,
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {},
          },
        },
        tooltip: {
          //提示框组件
          trigger: 'item',
          formatter: '{b}<br/>{c} 万平方公里',
        },
        series: [
          {
            name: '国家面积',
            type: 'map',
            mapType: 'world',
            roam: false,
            mapLocation: { y: 100 },
            data: this.data, //绑定数据
            nameMap: this.nameMap,
            symbolSize: 12,
            label: {
              normal: { show: false },
              emphasis: { show: false },
            },
            itemStyle: {
              emphasis: {
                borderColor: '#fff',
                borderWidth: 1,
              },
            },
          },
        ],
      })
    },
  },
}
</script>
