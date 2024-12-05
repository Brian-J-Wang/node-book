import { useEffect } from 'react'
import './App.css'
import ContextMenu from './components/contextMenu/ContextMenu'
import NodeViewer from './components/nodeviewer/nodeviewer'
import NodeEditor from './components/nodeEditor/nodeEditor'
import GlobalDragController from './properties/draggable/globalDragController'
import Collection from './components/collection/Collection'
import SideBar from './components/side-bar/sidebar'

function App() {

  useEffect(() => {
    document.addEventListener('contextmenu', (evt) => {
      evt.preventDefault();
    });
  })


  return (
    <div className='app'>
      <div >
        <Collection>
        <GlobalDragController>
          <ContextMenu>
          <SideBar>
            <NodeViewer/>
          </SideBar>
          </ContextMenu>
        </GlobalDragController>
        </Collection>
      </div>
    </div>
    
  )
}

export default App
