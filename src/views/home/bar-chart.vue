<template>
  <div ref="lineChartRef" class="charts"></div>
</template>

<script>
export default {
  name: 'BarChart',
  props: {
    chartdata: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      barChart: null
    }
  },
  watch: {
    chartdata(newValue) {
      if (newValue) {
        this.$nextTick(() => {
          this.init()
        })
      }
    }
  },
  mounted() {
    this.barChart = this.$echarts.init(this.$refs.lineChartRef)
    this.$nextTick(() => {
      this.init()
    })
  },
  beforeDestroy() {
    this.barChart.dispose()
    this.barChart = null
  },
  methods: {
    init() {
      let data = {
        area: [],
        legend: ['正常', '空闲', '异常'],
        data: []
      }

      const dataZc = []
      const dataKx = []
      const dataTj = []

      this.chartdata.forEach((item) => {
        data.area.push(item.xaxis)
        const zc = item?.statusList.find((i) => i.state == 'SBYXZT-ZC')
        const tj = item?.statusList.find((i) => i.state == 'SBYXZT-TJ')
        const kx = item?.statusList.find((i) => i.state == 'SBYXZT-KX')
        dataZc.push(zc?.rate ? zc.rate / 100 : 0)
        dataKx.push(kx?.rate ? kx.rate / 100 : 0)
        dataTj.push(tj?.rate ? tj.rate / 100 : 0)
      })

      data.data = [dataZc, dataKx, dataTj]

      let colors = ['#50838b', '#a7ddd2', '#72acba']

      // let colors = ['#69c0ff', '#95de64', '#ff9c6e']

      let option = {
        color: colors,
        legend: {
          show: true,
          top: '0',
          itemGap: 12,
          textStyle: {
            fontSize: 14
          },
          data: data.legend
        },
        grid: {
          top: '40',
          left: '40',
          right: '40',
          bottom: '40'
        },
        xAxis: {
          type: 'category',
          axisTick: {
            show: false
          },
          data: data.area
        },
        yAxis: {
          type: 'value',
          max: 1,
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(150, 164, 244, 0.3)',
              type: 'dashed' // 设置为虚线
            }
          }
        },
        series: []
      }
      for (var i = 0; i < data.data.length; i++) {
        option.series.push({
          name: data.legend[i],
          type: 'bar',
          stack: '总量',
          barWidth: '45%',
          label: {
            show: false,
            position: 'insideRight'
          },
          data: data.data[i]
        })
      }
      option && this.barChart.setOption(option)
    }
  }
}
</script>

<style lang="less" scoped>
.charts {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
