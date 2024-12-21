import { createContext, ReactNode, useRef, useState } from "react"

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
    const currentMode = useRef<canvasModes>("edit");

    function updateMode(mode: canvasModes) {
        console.log(mode);
        currentMode.current = mode;
    }

    return (
        <CanvasModeContext.Provider value={{mode: currentMode.current, setMode: updateMode}}>
            {props.children}
        </CanvasModeContext.Provider>
    )
}

export default CanvasMode;