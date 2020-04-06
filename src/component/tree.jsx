import React, { useContext, useState } from 'react'
import cx from 'classnames'
import treeContext from '../context/tree-context'

function Tree(props) {
  const { treeData, isFolder } = props
  const currentNodeId = treeData.id
  const { selectNodeId, selectNode } = useContext(treeContext)
  const [collapsed, setCollapsed] = useState(
    // 根目录默认打开
    currentNodeId === 0
    ? false
    : (props.collapsed || true)
  )

  const toggleCollapse = ev => {
    setCollapsed(!collapsed)
    ev.stopPropagation()
  }

  let children // 当前文件夹的子文件夹
  let leaf // 当前文件夹的文件，叶子结点

  // 当前文件夹折叠
  if (collapsed) {
    children = []
    leaf = []
  } else {
    // 当前文件夹展开
    children = (treeData.children || []).map((item, idx) => {
      return <Tree
        treeData={item}
        key={item.id}
        isFolder={true}
      />
    })
    leaf = (treeData.file || []).map((item, idx) => {
      let data = {
        ...item
      }

      return <Tree
        key={item.id}
        treeData={data}
        isFolder={false}
      />
    })
  }

  return <div className="t-node">
    <div
      className="t-text"
      onClick={() => selectNode(currentNodeId, isFolder ? 'folder' : 'file')}
    >
      {
        isFolder &&
        <i
          className={cx([
            't-arrow t-icon t-icon-right-arrow',
            { rotate: !collapsed }
          ])}
          onClick={toggleCollapse}
        ></i>
      }
      <span
        className={cx([
          't-name',
          {
            file: !isFolder,
            active: currentNodeId === selectNodeId
          }
        ])}
      >
        {treeData.name}
      </span>
    </div>
    {children}
    {leaf}
  </div>
}


export default Tree
