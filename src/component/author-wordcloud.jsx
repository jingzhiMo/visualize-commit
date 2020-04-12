import React, { useState } from 'react'
import Select from 'antd/es/select'
import Echarts from './echarts.jsx'
import { wordcloud } from '../service/echarts-wordcloud'

const { Option } = Select

function AuthorWordCloud ({ data }) {
  const author = [
    'all',
    ...Object.keys(data).filter(name => name !== 'all')
  ]
  const [selectAuthor, setSelectAuthor] = useState(author[0]) // 默认选中所有人
  const authorMap = {
    all: '所有人'
  }

  const updateSelect = value => {
    setSelectAuthor(value)
  }
  return <div>
    <h2 className="vsz-title">
      <span>不同用户 commit 信息文案分析</span>
    </h2>
    <Select
      style={{ width: 200 }}
      value={selectAuthor}
      onChange={updateSelect}
    >
      {
        author.map(item => {
          return <Option value={item} key={item} >{authorMap[item] || item}</Option>
        })
      }
    </Select>
    <Echarts chartData={wordcloud(data[selectAuthor])} />
  </div>
}

export default AuthorWordCloud
