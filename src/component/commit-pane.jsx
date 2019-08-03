import React from 'react'
import { bar } from '../service/echarts-bar.js'
import Echarts from './echarts.jsx'

function commitPane ({commit: commitData, line: lineData}) {
  // 对贡献 commit 进行排序
  commitData = commitData.slice(0).sort((a, b) => b.commit - a.commit)
  // 计算用户每个 commit 平均添加代码行数
  lineData = lineData.slice(0).map(item => {
    let author = commitData.filter(cd => cd.author === item.author)[0]

    if (!author) return

    return {
      average: (parseInt(item.line) / parseInt(author.commit)).toFixed(2),
      author: item.author
    }
  }).filter(item => item).sort((a, b) => b.average - a.average)

  const commitChart = bar(commitData, {
    title: 'commit 数量排行',
    tooltipDesc: 'commit 数量',
    seriesProp: 'commit'
  })
  const averageChart = bar(lineData, {
    title: 'commit 平均贡献代码行数',
    tooltipDesc: '每个 commit 平均贡献代码行数',
    seriesProp: 'average'
  })

  return <div>
    <h2 className="vsz-title">
      <span>不同用户对应贡献的代码详情</span>
    </h2>
    <Echarts
      clazz="vsz-code-summary__echart"
      chartData={commitChart}
    />
    <Echarts
      clazz="vsz-code-summary__echart"
      chartData={averageChart}
    />
  </div>
}

export default commitPane
