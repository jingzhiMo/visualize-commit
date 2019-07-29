import React from 'react'
import logo from './logo.svg'
import './App.css'
import Tree from './component/tree.jsx'
import Echarts from './component/echarts.jsx'
import AuthorFile from './component/author-file.jsx'

const source = window._source

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
    }),
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

class App extends React.Component {
  constructor () {
    super()
    this.selectNode = this.selectNode.bind(this)
    this.state = {
      selectNodeId: 0,
      treeData: extractSummary(depthFindFile(0, 'folder', source))
    }
  }

  selectNode (id, type) {
    this.setState({
      selectNodeId: id,
      treeData: extractSummary(depthFindFile(id, type, source))
    })
  }

  render () {
    return <div className="tree">
      <aside className="tree-aside">
        <Tree
          treeData={source}
          isFolder={true}
          selectNodeId={this.state.selectNodeId}
          select={this.selectNode}
          collapsed={false}
        />
      </aside>
      <main className="tree-content">
        <img className="t-logo loading" src={logo} alt="logo" />
        <h2 className="vsz-title">
          <span>代码统计概览</span>
        </h2>
        <div className="t-line">
          <div>
            <p className="t-code-line">文件路径：{this.state.treeData.path}</p>
            <p className="t-code-line">该文件/文件夹代码行数为：{this.state.treeData.line}</p>
          </div>
        </div>
        <div className="vsz-code-summary">
          <Echarts
            clazz="vsz-code-summary__echart"
            chartData={extractContribution(this.state.treeData)}
            title="代码贡献占比"
          />
          <Echarts
            clazz="vsz-code-summary__echart"
            chartData={extractFileType(this.state.treeData)}
            title="文件数量占比"
          />
        </div>
        <AuthorFile data={this.state.treeData} />
      </main>
    </div>
  }
}

export default App;
