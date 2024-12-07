import { createContext, ReactNode, RefObject, useRef, useState } from "react"
import { contextNotFound } from "../../utils/defaults";
import BoundingBox, { OutofBoundsHandle } from "../../properties/detectOutofBounds/boundingBox";

import "./sidebar.css"

interface SideBarProps {
    children: ReactNode
}

interface SideBarContextProps {
    openSideBar: (content: ReactNode, onSideBarClose?: () => void) => void,
    closeSideBar: () => void
}

export const SideBarContext = createContext<SideBarContextProps>({
    openSideBar: contextNotFound,
    closeSideBar: contextNotFound
});

const SideBar = ({children} : SideBarProps) => {
    const [ isVisible, setIsVisible] = useState<boolean>(false);
    const [ content, setContent ] = useState<ReactNode>(<></>);
    const sideBarCloseHandler = useRef<() => void>(() => {});
    const boundController = useRef<OutofBoundsHandle>() as RefObject<OutofBoundsHandle>;

    const openSideBar = (innerComponent: ReactNode, onSideBarClose: () => void = () => {}) => {
        setContent(innerComponent);
        sideBarCloseHandler.current = onSideBarClose;
        boundController.current?.setListen(true);
        setIsVisible(true);
    }

    const closeSideBar = () => {
        sideBarCloseHandler.current();
        boundController.current?.setListen(false);
        setIsVisible(false);
    }

    return (
        <SideBarContext.Provider value={{openSideBar, closeSideBar}}>
        <BoundingBox ref={boundController} onOutOfBound={closeSideBar}>
            <div className={`side-bar ${!isVisible && 'side-bar__hidden' }`} data-bounding-element>
                { content }
            </div>
            { children }
        </BoundingBox>
        </SideBarContext.Provider>
    )
}

export default SideBar;