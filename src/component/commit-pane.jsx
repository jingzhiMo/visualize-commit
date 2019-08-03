import React from 'react'
import { bar } from '../service/echarts-bar.js'
import Echarts from './echarts.jsx'

function commitPane ({commit: commitData, line: lineData}) {
  let chartData

  // 对贡献 commit 进行排序
  commitData = commitData.slice(0).sort((a, b) => b.commit - a.commit).map(item => {
    let author = lineData.filter(ld => ld.author === item.author)[0]

    if (!author) return

    return {
      ...item,
      average: parseInt(author.line / item.commit).toFixed(2)
    }
  }).filter(item => !!item)

  chartData = bar(commitData)

  return <div>
    <h2 className="vsz-title">
      <span>不同用户对应贡献的 commit 详情</span>
    </h2>
    <Echarts
      clazz="vsz-code-summary__echart"
      chartData={chartData}
    />
  </div>
}

export default commitPane
