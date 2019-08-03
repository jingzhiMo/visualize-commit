import React from 'react'
import { bar } from '../service/echarts-bar.js'
import Echarts from './echarts.jsx'

function commitPane ({data}) {
  data.sort((a, b) => b.commit - a.commit)
  const chartData = bar(data, {
    title: 'commit 数量排行'
  })

  console.log(chartData)
  return <div>
    <h2 className="vsz-title">
      <span>不同用户对应贡献的代码详情</span>
    </h2>
    <Echarts
      clazz="vsz-code-summary__echart"
      chartData={chartData}
    />
  </div>
}

export default commitPane
