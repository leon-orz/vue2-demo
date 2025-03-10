<template>
  <div ref="lineChartRef" class="charts"></div>
</template>

<script>
export default {
  name: 'LineChart',
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
      default: () => ({})
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
        // error
        this.$nextTick(() => {
          this.init()
        })
      }
    }
  },
  mounted() {
    this.pieChart = this.$echarts.init(this.$refs.lineChartRef)
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
      const handred = 100
      let point = this.chartdata[0]?.maxValue
        ? Math.floor(Number((this.chartdata[0]?.actualValue / this.chartdata[0]?.maxValue) * 100))
        : 0
      const max = this.chartdata[0]?.maxValue || 0
      const cur = this.chartdata[0]?.actualValue || 0
      const option = {
        title: {
          text: point + '%',
          x: 'center',
          y: 'center',
          textStyle: {
            fontWeight: 'normal',
            fontSize: '20'
          }
        },
        tooltip: {
          formatter: function (params) {
            return params.name + '：' + params.percent + ' %'
          }
        },
        legend: {
          show: true,
          itemGap: 12,
          data: ['占比'],
          bottom: 10,
          formatter: function (data) {
            return `实际/最大: ${cur}/${max}`
          }
        },

        series: [
          {
            name: 'circle',
            type: 'pie',
            clockWise: true,
            center: ['50%', '50%'],
            radius: ['45%', '55%'],
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            hoverAnimation: false,
            data: [
              {
                value: point,
                name: '占比',
                itemStyle: {
                  normal: {
                    color: '#4f848a',
                    label: {
                      show: false
                    },
                    labelLine: {
                      show: false
                    }
                  }
                }
              },
              {
                name: '剩余',
                value: handred - point,
                itemStyle: {
                  normal: {
                    color: '#71acb0'
                  }
                }
              }
            ]
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
