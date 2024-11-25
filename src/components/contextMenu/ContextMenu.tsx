import { createContext, ReactNode, useEffect, useState } from "react";
import { Position } from "../nodeviewer/nodeviewer";

export const contextMenuContext = createContext<{
    openContext: (menu: ReactNode, position: Position) => void
}>({
    openContext: function (menu: ReactNode): void {
        throw new Error("Function not implemented.");
    },
});

const ContextMenu : React.FC<{children: ReactNode}> = ({children}) => {
    const [menu, setMenu] = useState<ReactNode>(null);
    const [position, setPosition] = useState<Position>({x: 0, y: 0});

    const openContextMenu = (menu: ReactNode, position: Position) => {
        setMenu(menu);
        setPosition(position);
    }

    useEffect(() => {
        document.addEventListener("mousedown", closeContextMenu);

        return () => {
            document.removeEventListener('mousedown', closeContextMenu)
        }
    }, [menu]);

    function closeContextMenu(evt:any) {
        if (evt.button == 0) {
            setMenu(null);
        }
        
    }

    return (
        <contextMenuContext.Provider value={{openContext: openContextMenu}}>
            <div className="cm_"style={{position: 'absolute', top: position.y, left: position.x, zIndex: 3}}>
                {menu}
            </div>
            {children}
        </contextMenuContext.Provider>
    )
}

export default ContextMenu;