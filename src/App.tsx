import { useEffect } from 'react'
import './App.css'
import ContextMenu from './components/contextMenu/ContextMenu'
import GlobalDragController from './properties/draggable/globalDragController'
import Collection from './components/collection/Collection'
import SideBar from './components/side-bar/sidebar'
import DraggableCanvas from './properties/canvas/canvas'

function App() {

  useEffect(() => {
    const prevent = (evt: any) => { evt.preventDefault()}

    document.addEventListener('contextmenu', prevent);

    return () => {
      document.removeEventListener('contextmenu', prevent);
    }
  })


  return (
    <div className='app'>
      <div >
        <Collection>
        <GlobalDragController>
          <ContextMenu>
          <SideBar>
          <DraggableCanvas/>
          </SideBar>
          </ContextMenu>
        </GlobalDragController>
        </Collection>
      </div>
    </div>
    
  )
}

export default App
