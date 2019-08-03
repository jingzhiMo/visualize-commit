export const bar = (data, option = {}) => {
  let legendData = []
  let seriesData = []

  data.forEach(item => {
    legendData.push(item.author)
    seriesData.push(item[option.seriesProp])
  })

  return {
    title: {
      text: option.title,
      x: 'center',
      top: 0
    },
    color: [
      '#5097e9',
      '#00bcd4',
      '#ffa726',
      '#e57373',
      '#8d6e63',
      '#9575cd',
      '#ff8a65',
      '#81c784',
      '#ce93d8',
      '#90a4ae',
      '#9dc6f5',
      '#80deea',
      '#ffcc80',
      '#ef9a9a',
      '#bcaaa4',
      '#d1c4e9',
      '#ffccbc',
      '#c8e6c9',
      '#e1bee7',
      '#cfd8dc'
    ],
    tooltip : {
      trigger: 'item',
      showDelay: 20,
      formatter (param) {
        return  `${param.name} ${option.tooltipDesc}：${param.data}`
      }
    },
    xAxis: {
      type: 'category',
      data: legendData,
      axisTick: {
        show: false
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#d0d3da'
        }
      },
      axisLabel: {
        color: '#909399'
      },
      splitLine: {
          lineStyle: {
              color: '#909939',
              type: 'solid'
          }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#909399'
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#d0d3da'
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
            color: '#ebeef5'
        }
      }
    },
    series : [
      {
          name: option.title,
          data: seriesData,
          type: 'bar',
          barMaxWidth: '48px',
          barMinHeight: 4
      }
    ]
  }
}
