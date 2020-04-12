import colorSet from './color'
import 'echarts-wordcloud'

export const wordcloud = (data, chartOption) => {
  let option = {
    title: {
      text: '',
      left: 'center'
    },
    tooltip: {
      padding: 10,
      trigger: 'item',
      textStyle: {
        color: '#fff'
      },
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: 'rgba(33, 35, 41, 0.1)'
        }
      },
      formatter: '{b} 出现次数：{c} 次'
    },
    visualMap: {
      show: false,
      type: 'continuous'
    },
    series: [{
      type: 'wordCloud',
      shape: 'circle',
      left: 'center',
      top: 'center',
      width: '100%',
      height: '80%',
      right: null,
      bottom: null,
      sizeRange: [20, 80],
      rotationRange: [0, 0],
      rotationStep: 45,
      gridSize: 14,
      drawOutOfBound: false,

      textStyle: {
        normal: {
          fontWeight: 'normal',
          color: function (params) {
            return colorSet[params.dataIndex % colorSet.length]
          }
        }
      },
      data: data
    }]
  }

  return option
}
