import { createContext, ReactNode, RefObject, useRef, useState } from "react";
import { Position } from "../../utils/math/position";
import BoundingBox, { OutofBoundsHandle } from "../../properties/detectOutofBounds/boundingBox";

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
            <BoundingBox ref={boundController} onOutOfBound={closeContextMenu}>
                <div className="cm_"style={{position: 'absolute', top: position.y, left: position.x, zIndex: 3}}>
                    {menu}
                </div>
            </BoundingBox>
            {children}
        </contextMenuContext.Provider>
    )
}

export default ContextMenu;