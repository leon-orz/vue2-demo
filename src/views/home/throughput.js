export function barLineEcharVray(columnDataOne, columnDataTwo, lineData, xData) {
  return {
    option: {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      // grid: {
      //   left: '2%',
      //   right: '3%',
      //   bottom: '2%',
      //   top: '8%',
      //   containLabel: true
      // },
      legend: {
        data: ['吞量', '吐量', '总量']
      },
      xAxis: [
        {
          type: 'category',
          // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          data: xData,
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '单位：',
          interval: 50,
          axisLine: {
            show: true
          }
        }
      ],
      series: [
        {
          name: '吞量',
          type: 'bar',
          barWidth: 10,
          data: columnDataOne,
          color: '#24A2FF',
          label: {
            show: true
          }
        },
        {
          name: '吐量',
          type: 'bar',
          barWidth: 10,
          data: columnDataTwo,
          color: '#F2B516',
          label: {
            show: true
          }
        },
        {
          name: '总量',
          type: 'line',
          symbolSize: 10,
          data: lineData,
          color: '#F2B516',
          label: {
            show: true
          }
        }
      ]
    }
  }
}
