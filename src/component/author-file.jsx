import React, { useState } from 'react'
import Select from 'antd/es/select'
import 'antd/dist/antd.css'
import Echarts from './echarts.jsx'
import { pie } from '../service/echarts-pie'

const { Option } = Select

/**
 *  @desc  合并两个用户贡献代码到到第一个用户
 *  @param  {Object}  target  合并目标用户 { author: { json: xx, js: xx } }
 *  @param  {Object}  source  合并源用户
 */
function mergeAuthor (target, source) {
  for (let name in source) {
    let targetAuthor = target[name]
    let sourceAuthor = source[name]

    if (targetAuthor) {
      for (let fileType in sourceAuthor) {
        targetAuthor[fileType] = (targetAuthor[fileType] || 0) + sourceAuthor[fileType]
      }
    } else {
      target[name] = source[name]
    }
  }

  return target
}

/**
 *  @desc  该节点下，每个作者贡献的不同类型
 */
function extractAuthorFile (sourceData) {
  let author = {} // e.g { authorName: { vue: 100, json: 50 }}

  // 当前数据是只针对一个文件
  if (!sourceData.file && sourceData.contribution) {
    let fileType = sourceData.type

    return sourceData.contribution.reduce((base, item) => {
      base[item.author] = {}
      base[item.author][fileType] = item.line

      return base
    }, author)
  }
  // 遍历当前节点的文件类型
  for (let file of (sourceData.file || [])) {
    let fileType = file.type

    for (let contribution of file.contribution) {
      let fileLine = {}
      const { line, author: name } = contribution

      fileLine[fileType] = line // e.g { vue: 100 }

      if (author[name]) {
        author[name][fileType] = (author[name][fileType] || 0) + line
      } else {
        author[name] = fileLine
      }
    }
  }


  if (!sourceData.children || !sourceData.children.length) return author

  // 有对应的子节点
  return sourceData.children.reduce((base, child) => {
    const childAuthor = extractAuthorFile(child)

    // 合并子节点的数据
    return mergeAuthor(base, childAuthor)
  }, author)
}

function genAuthor (allAuthorData, authorName) {
  let authorData

  // 没有指定用户名，则取第一个
  if (!authorName) {
    authorName = Object.keys(allAuthorData)[0]
  }

  authorData = allAuthorData[authorName]

  let fileList = authorData ? Object.keys(authorData) : []

  return {
    title: `${authorName || ''} 贡献文件类型`,
    chartData: {
      data: fileList.map(type => {
        return {
          name: type,
          value: authorData[type]
        }
      }).sort((a, b) => b.value - a.value),
      legendData: fileList
    }
  }
}

function AuthorFile (props) {
  const allAuthorData = extractAuthorFile(props.data)
  const allAuthorName = Object.keys(allAuthorData)
  const [authorData, setAuthorData] = useState(genAuthor(allAuthorData))
  const [selectAuthor, setSelectAuthor] = useState(allAuthorName[0])

  function updateSelect (value) {
    setSelectAuthor(value)
    setAuthorData(genAuthor(allAuthorData, value))
  }

  return <div className="vsz-author-detail">
    <h2 className="vsz-title">
      <span>不同用户对应贡献的代码详情</span>
    </h2>
    <Select
      style={{ width: 200 }}
      value={selectAuthor}
      onChange={updateSelect}
    >
      {
        allAuthorName.map(item => {
          return <Option value={item} key={item} >{item}</Option>
        })
      }
    </Select>
    <Echarts
      chartData={pie(authorData.chartData, { title: authorData.title})}
    />
  </div>
}

export default AuthorFile
