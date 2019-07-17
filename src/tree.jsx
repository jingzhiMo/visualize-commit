import React from 'react'

class Tree extends React.Component {
  constructor (props) {
    super(props)
    const { treeData, selectNodeId, collapsed = true } = props

    this.state = {
      active: false,
      // 当前节点的id
      currentNodeId: treeData.id,
      selectNodeId,
      // 当前文件夹是否折叠
      collapsed
    }
  }

  componentWillReceiveProps (nextProp) {
    if (nextProp.selectNodeId === this.state.selectNodeId) return

    this.setState({
      selectNodeId: nextProp.selectNodeId
    })
  }

  // 切换折叠
  toggleCollapse (id, ev) {
    this.setState({
      collapsed: !this.state.collapsed
    })
    ev.stopPropagation()
  }

  render () {
    let { treeData } = this.props
    let { currentNodeId } = this.state

    let children // 当前文件夹的子文件夹
    let leaf // 当前文件夹的文件，叶子结点

    // 当前文件夹折叠
    if (this.state.collapsed) {
      children = []
      leaf = []
    } else {
      // 当前文件夹展开
      children = (treeData.children || []).map((item, idx) => {
        return <Tree
          treeData={item}
          key={idx}
          isFolder={true}
          selectNodeId={this.state.selectNodeId}
          select={(argId, type) => this.props.select(argId, type)}
        />
      })
      leaf = (treeData.file || []).map((item, idx) => {
        let data = {
          ...item
        }

        return <Tree
          key={idx}
          treeData={data}
          isFolder={false}
          selectNodeId={this.state.selectNodeId}
          select={(argId, type) => this.props.select(argId, type)}
        />
      })
    }

    return <div className="t-node">
      <div className="t-text" onClick={() => this.props.select(currentNodeId, this.props.isFolder ? 'folder' : 'file')}>
        {
          this.props.isFolder &&
          <i
            className={'t-arrow t-icon t-icon-right-arrow' + (this.state.collapsed ? '' : ' rotate')}
            onClick={(ev) => this.toggleCollapse(currentNodeId, ev)}
          ></i>
        }
        <span className={'t-name' + (this.props.isFolder ? '' : ' file') + (currentNodeId === this.state.selectNodeId ? ' active' : '')} >{treeData.name}</span>
      </div>
      {children}
      {leaf}
    </div>
  }
}

export default Tree
