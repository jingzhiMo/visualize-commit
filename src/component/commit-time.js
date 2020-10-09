import React, { useState } from 'react'
import Select from 'antd/es/select'
import { authorMap } from '../const'

const { Option } = Select

export default function CommitTime(props) {
  const { data } = props
  const [selectAuthor, setSelectAuthor] = useState('all')

  return (
    <div className="vsz-commit-time">
      <h2 className="vsz-title">
        <span>每周代码详情</span>
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
    </div>
  )
}
