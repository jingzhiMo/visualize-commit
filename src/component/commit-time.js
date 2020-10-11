import React, { useState } from 'react'
import Select from 'antd/es/select'
import { commitTimeBar } from '../service/echarts-bar.js'
import Echarts from './echarts.jsx'
import { authorMap } from '../const'

const { Option } = Select

export default function CommitTime(props) {
  const { data } = props
  const [selectAuthor, setSelectAuthor] = useState('all')

  const selectData = data.filter(item => item.author === selectAuthor)
  const chartData = commitTimeBar(selectData.length ? selectData[0].time : [])

  return (
    <div className="vsz-commit-time">
      <h2 className="vsz-title">
        <span>一周每天代码详情</span>
      </h2>
      <Select
        style={{ width: 200 }}
        value={selectAuthor}
          onChange={setSelectAuthor}
      >
        {
          data.map(({ author }) => {
            return <Option value={author} key={author} >{authorMap[author] || author}</Option>
          })
        }
      </Select>
    <Echarts
      clazz="vsz-code-summary__echart"
      chartData={chartData}
    />
    </div>
  )
}
