import { useEffect } from 'react'
import './App.css'
import ContextMenu from './components/contextMenu/ContextMenu'
import NodeViewer from './components/nodeviewer/nodeviewer'
import NodeEditor from './components/nodeEditor/nodeEditor'
import GlobalDragController from './properties/draggable/globalDragController'
import Collection from './components/collection/Collection'

function App() {

  useEffect(() => {
    document.addEventListener('contextmenu', (evt) => {
      evt.preventDefault();
    });
  })


  return (
    <div className='app' style={{overflow: 'hidden'}}>
      <div >
        <Collection>
          <GlobalDragController>
            <ContextMenu>
              <NodeEditor>
                <NodeViewer/>
              </NodeEditor>
            </ContextMenu>
          </GlobalDragController>
        </Collection>
      </div>
    </div>
    
  )
}

export default App
