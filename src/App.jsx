import React, { useState, useCallback, useMemo } from 'react'
import logo from './logo.svg'
import './App.css'
import Tree from './component/tree.jsx'
import Echarts from './component/echarts.jsx'
import AuthorFile from './component/author-file.jsx'
import AuthorWordCloud from './component/author-wordcloud.jsx'
import CommitPane from './component/commit-pane.jsx'
import CommitTimePane from './component/commit-time'
import { pie } from './service/echarts-pie'
import treeContext from './context/tree-context'

const { codeData, commitData, wordCloudData, commitTime } = window._source

/**
 *  @desc  深度优先查找文件
 *  @param  {Number}  id 文件对应的id
 *  @param  {String}  type  文件/文件夹
 *  @param  {Object}  treeData  需要查找的树状数据
 */
function depthFindFile (id, type, treeData) {
  // 找到当前的节点数据
  if (id === treeData.id) return treeData

  // 选中节点的数据
  let nodeData = null

  // 查找文件夹
  if (type === 'folder') {
    for (let i = 0; i < treeData.children.length; i++) {
      nodeData = depthFindFile(id, type, treeData.children[i])

      if (nodeData) break
    }

    return nodeData
  }

  // 查找文件
  // 文件所在当前文件夹内
  if (treeData.file.length && id >= treeData.file[0].id) {
    return treeData.file.find(item => item.id === id)
  }

  // 文件不在当前文件夹
  for (let i = 0; i < treeData.children.length; i++) {
    nodeData = depthFindFile(id, type, treeData.children[i])

    if (nodeData) break
  }

  return nodeData
}

/**
 *  @desc  提取当前文件夹的简要数据
 *  @param  {Object}  detailData  当前文件夹的详细数据
 */
function extractSummary (detailData) {
  let key = ['code', 'contribution', 'file', 'id', 'line', 'name', 'path', 'type', 'children']
  let summary = {}

  key.forEach(k => {
    summary[k] = detailData[k]
  })

  return summary
}

/**
 *  @desc  提取代码贡献数据
 *  @param  {Object}  sourceData  树状图的源数据
 */
function extractContribution (sourceData) {
  let contribution = sourceData.contribution.slice(0).sort((a, b) => b.line - a.line)
  return {
    data: contribution.map(item => {
      return {
        value: item.line,
        name: item.author
      }
    }).sort((a, b) => b.value - a.value).slice(0, 20),
    legendData: contribution.map(item => item.author)
  }
}

/**
 *  @desc  提取代码文件类型数据
 *  @param  {Object}  sourceData  树状图的源数据
 */
function extractFileType (sourceData) {
  let code = sourceData.code
  let data = []

  // 文件节点没有对应的代码
  if (!code) {
    return {
      data: [{
        name: sourceData.type,
        value: sourceData.line
      }],
      legendData: [sourceData.type]
    }
  }

  for (let key in code) {
    data.push({
      name: key,
      value: code[key]
    })
  }

  data.sort((a, b) => b.value - a.value)

  return {
    data,
    legendData: data.map(item => item.name)
  }
}

function App() {
  const [selectNodeId, setSelectNodeId] = useState(0)
  const [treeData, setTreeData] = useState(extractSummary(depthFindFile(0, 'folder', codeData)))

  // 修改节点数据
  const selectNode = useCallback((id, type) => {
    setSelectNodeId(id)
    setTreeData(extractSummary(depthFindFile(id, type, codeData)))
  }, [])
  const contextValue = {
    selectNodeId,
    selectNode
  }

  const codeContribution = useMemo(() => {
    return pie(extractContribution(treeData), {
      title: '代码贡献占比'
    })
  }, [treeData])
  const fileContribution = useMemo(() => {
    return pie(extractFileType(treeData), {
      title: '文件数量占比'
    })
  }, [treeData])

  return <div className="tree">
    <aside className="tree-aside">
      <treeContext.Provider value={contextValue}>
        <Tree
          treeData={codeData}
          isFolder={true}
          collapsed={false}
        />
      </treeContext.Provider>
    </aside>
    <main className="tree-content">
      <img className="t-logo loading" src={logo} alt="logo" />
      <h2 className="vsz-title">
        <span>代码统计概览</span>
      </h2>
      <div className="t-line">
        <div>
          <p className="t-code-line">文件路径：{treeData.path}</p>
          <p className="t-code-line">该文件/文件夹代码行数为：{treeData.line}</p>
        </div>
      </div>
      <div className="vsz-code-summary">
        <Echarts
          clazz="vsz-code-summary__echart"
          chartData={codeContribution}
        />
        <Echarts
          clazz="vsz-code-summary__echart"
          chartData={fileContribution}
        />
      </div>
      <CommitPane commit={commitData} line={codeData.contribution} />
      <CommitTimePane data={commitTime} />
      <AuthorFile data={treeData} />
      <AuthorWordCloud data={wordCloudData} />
    </main>
  </div>
}

export default App;
