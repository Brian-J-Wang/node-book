import { createContext, useEffect, useState } from "react"

type globalDragContextProps = {
    updateSuppress: (value: boolean) => void,
    isSuppress: boolean
}

export const GlobalDragContext = createContext<globalDragContextProps>({
    updateSuppress: () => {},
    isSuppress: false
});

const GlobalDragController = ({children}: any) => {
    const [isSuppress, setIsSuppress] = useState<boolean>(false);

    //prevents drag effects from showing when suppress is active
    useEffect(() => {
        document.addEventListener("drag", handleDrag);

        return () => {
            document.removeEventListener("drag", handleDrag);
        }

        function handleDrag(evt: DragEvent) {
            if (isSuppress) {
                evt.preventDefault();
            }
        }
    })

    return (
        <GlobalDragContext.Provider value={{updateSuppress: setIsSuppress, isSuppress: isSuppress}}>
            {children}
        </GlobalDragContext.Provider>
    )
}

export default GlobalDragController