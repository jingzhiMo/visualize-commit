export const pie = (data, option = {}) => {
  return {
    title: {
      text: option.title,
      x:'center',
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
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      type: 'scroll',
      data: data.legendData,
      width: '80%',
      bottom: 0
    },
    series : [
      {
        name: option.title,
        type: 'pie',
        radius : '80%',
        center: ['50%', '50%'],
        label: {
          normal: {
            show: false
          },
          emphasis: {
            show: false
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: data.data
      }
    ]
  }
}
