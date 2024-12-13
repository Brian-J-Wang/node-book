import { useEffect } from 'react'
import './App.css'
import ContextMenu from './components/contextMenu/ContextMenu'
import Collection from './components/collection/Collection'
import SideBar from './components/side-bar/sidebar'
import DraggableCanvas from './properties/canvas/canvas'
import MetaBanner from './components/metaBanner/meta-banner'
import CanvasMode from './components/canvas-mode/canvas-mode'

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
      <div>
        <CanvasMode>
        <Collection>
          <MetaBanner/>
          <ContextMenu>
          <SideBar>
          <DraggableCanvas/>
          </SideBar>
          </ContextMenu>
        </Collection>
        </CanvasMode>
      </div>
    </div>
    
  )
}

export default App
