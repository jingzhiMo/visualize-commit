import { createContext } from 'react'

const treeContext = createContext({
  selectNodeId: 0,
  selectNode: () => {}
})
treeContext.displayName = 'treeContext'

export default treeContext
