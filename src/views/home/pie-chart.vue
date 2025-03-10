<template>
  <div ref="chartRef" class="charts"></div>
</template>

<script>
export default {
  name: 'PieChart',
  props: {
    name: {
      type: String,
      default: ''
    },
    chartdata: {
      type: Array,
      default: []
    },
    opts: {
      type: Object,
      default: () => ({
        legend: false,
        label: false,
        name: false
      })
    }
  },
  data() {
    return {
      pieChart: null
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
    this.pieChart = this.$echarts.init(this.$refs.chartRef)
    this.$nextTick(() => {
      this.init()
    })
  },
  beforeDestroy() {
    this.pieChart.dispose()
    this.pieChart = null
  },
  methods: {
    init() {
      let colors = ['#50838b', '#a7ddd2', '#72acba']
      let pieData = []

      if (this.name == '利用率') {
        const zc = this.chartdata.find((i) => i.state == 'SBYXZT-ZC')
        const kx = this.chartdata.find((i) => i.state == 'SBYXZT-KX')
        const tj = this.chartdata.find((i) => i.state == 'SBYXZT-TJ')
        pieData = [
          {
            value: zc?.rate || 0,
            value2: zc?.stateSt || 0,
            name: zc?.name || '正常'
          },
          {
            value: kx?.rate || 0,
            value2: kx?.stateSt || 0,
            name: kx?.name || '空闲'
          },
          {
            value: tj?.rate || 0,
            value2: tj?.stateSt || 0,
            name: tj?.name || '异常'
          }
        ]
      } else if (this.name == '设备运行状态') {
        const zc = this.chartdata.find((i) => i.status == 'SBYXZT-ZC')
        const kx = this.chartdata.find((i) => i.status == 'SBYXZT-KX')
        const tj = this.chartdata.find((i) => i.status == 'SBYXZT-TJ')
        pieData = [
          {
            value: zc?.count || 0,
            name: zc?.xaxis || '正常'
          },
          {
            value: kx?.count || 0,
            name: kx?.xaxis || '空闲'
          },
          {
            value: tj?.count || 0,
            name: tj?.xaxis || '异常'
          }
        ]
      } else {
        pieData = this.chartdata.map((item) => {
          return {
            value: item.count || 0,
            name: item.name || ''
          }
        })
      }

      const option = {
        color: colors,
        title: {
          show: this.name && this.opts.name ? true : false,
          text: this.name,
          textStyle: {
            fontSize: 12
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: this.name == '利用率' ? '{a}<br/>{b}: {c} ({d}%)' : '{a}<br/>{b}:{c}'
        },
        legend: {
          show: this.opts.legend ? true : false,
          bottom: 10
        },
        series: [
          {
            name: this.name,
            type: 'pie',
            center: ['50%', '45%'],
            radius: ['0%', '50%'],
            startAngle: 180,
            label: {
              show: true,
              formatter: function (data) {
                let str = ''
                const val = data.data
                if (data.seriesName == '利用率') {
                  str = `${val.name}: ${val.value2} (${val.value}%)`
                } else {
                  str = `${val.name}: ${val.value}`
                }
                return str
              },
              // this.name == '利用率' ? '{b}: {c} ({d}%)' : this.opts.label ? '{b}: {c}' : '{b}: {c}'
              position: 'outer',
              alignTo: 'labelLine',

              minMargin: 5, // 标签之间的最小距离
              edgeDistance: 10,
              lineHeight: 15,
              overflow: 'break',
              distance: 60 // 调整标签与扇区的距离
            },
            labelLine: {
              show: true,
              length: 10, // 调整引导线的第一段长度
              length2: 20 // 调整引导线的第二段长度
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: pieData
          }
        ]
      }
      option && this.pieChart.setOption(option)
    }
  }
}
</script>

<style lang="less" scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
