import { createContext, ReactNode, useState } from "react"

type canvasModes = "edit" | "draw";
export const CanvasModeContext = createContext<{
    mode: canvasModes,
    setMode: (mode: canvasModes) => void
}>({
    mode: "edit",
    setMode: () => {}
})

type CanvasModeProps = {
    children: ReactNode
}

const CanvasMode = (props: CanvasModeProps ) => {
    const [mode, setMode] = useState<canvasModes>("edit");


    return (
        <CanvasModeContext.Provider value={{mode: mode, setMode: setMode}}>
            {props.children}
        </CanvasModeContext.Provider>
    )
}

export default CanvasMode;