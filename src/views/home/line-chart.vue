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
    }
  },
  data() {
    return {
      lineChart: null
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
    this.lineChart = this.$echarts.init(this.$refs.lineChartRef)
    this.$nextTick(() => {
      this.init()
    })
  },
  beforeDestroy() {
    this.lineChart.dispose()
    this.lineChart = null
  },
  methods: {
    init() {
      // error

      let option = null
      const colors = ['#9acc8f', '#77bdeb', '#edd972']

      if (this.name == '吞吐量') {
        option = {
          color: colors,
          xAxis: {
            type: 'category',
            data: this.chartdata.map((item) => item.name), // xaxis
            axisTick: {
              alignWithLabel: true
            }
          },
          yAxis: [
            {
              type: 'value'
            },
            {
              type: 'value'
            }
          ],
          tooltip: {
            show: true
          },
          legend: {
            show: true
          },
          grid: {
            top: '40',
            left: '40',
            right: '40',
            bottom: '40'
          },
          series: [
            {
              name: '吞吐量', // 道口 仓储
              type: 'bar',
              data: this.chartdata.map((item) => item.throughput),
              label: {
                show: false
              },
              yAxisIndex: 0
            },
            {
              name: '利用率',
              type: 'line',
              data: this.chartdata.map((item) => item.rate / 100),
              label: {
                show: false
              },
              yAxisIndex: 1
            },
            {
              name: '仓储占比',
              type: 'line',
              data: this.chartdata.map((item) => item.storageRate / 100),
              label: {
                show: false
              },
              yAxisIndex: 1
            }
          ]
        }
      } else {
        option = {
          color: colors,
          xAxis: {
            type: 'category',
            data: this.chartdata.map((item) => item.name), // xaxis
            axisTick: {
              alignWithLabel: true
            }
          },
          yAxis: [
            {
              type: 'value'
            },
            {
              type: 'value'
            }
          ],
          tooltip: {
            show: true
          },
          legend: {
            show: true
          },
          grid: {
            top: '40',
            left: '40',
            right: '40',
            bottom: '40'
          },
          series: [
            {
              name: '任务量', // agv 其他
              type: 'bar',
              data: this.chartdata.map((item) => item.throughput),
              label: {
                show: false
              },
              yAxisIndex: 0
            },
            {
              name: '利用率',
              type: 'line',
              data: this.chartdata.map((item) => item.rate / 100),
              label: {
                show: false
              },
              yAxisIndex: 1
            },
            {
              name: '仓储占比',
              type: 'line',
              data: this.chartdata.map((item) => item.storageRate / 100),
              label: {
                show: false
              },
              yAxisIndex: 1
            }
          ]
        }
      }

      option && this.lineChart.setOption(option)
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
