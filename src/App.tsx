import { useEffect } from 'react'
import './App.css'
import ContextMenu from './components/contextMenu/ContextMenu'
import NodeViewer from './components/nodeviewer/nodeviewer'
import NodeEditor from './components/nodeEditor/nodeEditor'

function App() {

  useEffect(() => {
    document.addEventListener('contextmenu', (evt) => {
      evt.preventDefault();
    });
  })


  return (
    <div className='app' style={{overflow: 'hidden'}}>
      <div >
        <ContextMenu>
            <NodeEditor>
              <NodeViewer/>
            </NodeEditor>
        </ContextMenu>
      </div>
    </div>
    
  )
}

export default App
