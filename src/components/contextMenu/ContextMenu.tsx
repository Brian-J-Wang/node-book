import { createContext, ReactNode, RefObject, useRef, useState } from "react";
import { Position } from "../nodeviewer/nodeviewer";
import DetectOutOfBounds, { OutofBoundsHandle } from "../../properties/detectOutofBounds/detectOutOfBounds";

export const contextMenuContext = createContext<{
    openContext: (menu: ReactNode, position: Position) => void,
    closeContext: () => void
}>({
    openContext: () => {},
    closeContext: () => {}
});

const ContextMenu : React.FC<{children: ReactNode}> = ({children}) => {
    const [menu, setMenu] = useState<ReactNode>(null);
    const [position, setPosition] = useState<Position>({x: 0, y: 0});
    const boundingElement = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>;
    const boundController = useRef<OutofBoundsHandle>() as RefObject<OutofBoundsHandle>;

    const openContextMenu = (newMenu: ReactNode, position: Position) => {
        setMenu(newMenu);
        setPosition(position);
        boundController.current?.setListen(true);
    }

    function closeContextMenu(evt:any) {
        if (evt.button == 0) {
            setMenu(null);
        }
        boundController.current?.setListen(false);
    }

    function closeContextMenuInternal() {
        setMenu(null);
        boundController.current?.setListen(false);
    }

    return (
        <contextMenuContext.Provider value={{openContext: openContextMenu, closeContext: closeContextMenuInternal}}>
            <DetectOutOfBounds ref={boundController} boundingElement={boundingElement} onOutOfBound={closeContextMenu}>
                <div ref={boundingElement} className="cm_"style={{position: 'absolute', top: position.y, left: position.x, zIndex: 3}}>
                    {menu}
                </div>
            </DetectOutOfBounds>
            {children}
        </contextMenuContext.Provider>
    )
}

export default ContextMenu;