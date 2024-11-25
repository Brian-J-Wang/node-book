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

    document.addEventListener('dragover', (evt) => {
      evt.preventDefault();
    });
  })


  return (
    <div className='app'>
      <div>
        <ContextMenu>
          <NodeViewer/>
          <NodeEditor/>
        </ContextMenu>
      </div>
    </div>
    
  )
}

export default App
