import { createContext, useEffect, useState } from "react";
import { Position } from "../../utils/math/position";


type mouseData = {
    position: Position;
}
const CursorContext = createContext<mouseData>({
    position: {x: 0, y: 0}
});

const CanvasScaffold = () => {
    const [mousePosition, setMousePosition] = useState<Position>({x: 0, y: 0});

    useEffect(() => {
        document.addEventListener('mousemove', updateMousePosition);

        return () => {
            document.removeEventListener('mousemove', updateMousePosition);
        }

        function updateMousePosition(evt: MouseEvent) {
            setMousePosition({
                x: evt.clientX,
                y: evt.clientY,
            })
        }
    })

    return (
        <CursorContext.Provider value={{position: mousePosition}}>

        </CursorContext.Provider>
    )
}