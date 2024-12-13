import { createContext, ReactNode, useState } from "react"

type canvasModes = "edit" | "draw"
type canvasModeContextProps = {
    mode: canvasModes
    setMode: (mode: canvasModes) => void
}
const CanvasModeContext = createContext<canvasModeContextProps>({
    mode: "edit",
    setMode: () => {}
})

type CanvasModeProps = {
    children: ReactNode
}
const CanvasMode = (props: CanvasModeProps ) => {
    const [mode, setMode] = useState<canvasModes>("edit");
    return (
        <CanvasModeContext.Provider value={{mode, setMode}}>
            {props.children}
        </CanvasModeContext.Provider>
    )
}