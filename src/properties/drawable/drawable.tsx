import { createContext, ReactNode, useEffect, useRef, useState } from "react"
import { Position } from "../../components/nodeviewer/nodeviewer"

type DrawableProps = {
    children: ReactNode
}

export const DrawableContext = createContext<{
    isDrawing: boolean,
    startDrawing: () => void,
    stopDrawing: () => void,
}>({
    isDrawing: false,
    startDrawing: () => {},
    stopDrawing: () => {}
})

const Drawable = ({children}: DrawableProps) => {
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [intervalId, setIntervalId] = useState<number>(0);
    const [path, setPath] = useState<string>("");
    const mousePosition = useRef<Position>({x: 0, y: 0});

    const canvasContext = useRef<CanvasRenderingContext2D>();
    useEffect(() => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        canvasContext.current = ctx;

        if (canvasContext.current) {
            canvasContext.current.imageSmoothingEnabled = true;
            canvasContext.current.imageSmoothingQuality = "high";
        }
    }, [])

    function updateMousePosition(evt: React.MouseEvent) {
        mousePosition.current = {
            x: evt.clientX,
            y: evt.clientY
        }
    }

    function startDrawing() {
        setIsDrawing(true);

        if (canvasContext.current) {
            canvasContext.current?.beginPath();
            canvasContext.current?.moveTo(
                mousePosition.current.x,
                mousePosition.current.y
            );
            //@ts-ignore
            canvasContext.current.strokeStyle = 'black';
            canvasContext.current.lineWidth = 2;
            canvasContext.current.lineCap = 'round';
        }

        const id = setInterval(updatePath, 16.6);
        setIntervalId(id);
    }

    function stopDrawing() {
        setIsDrawing(false);

        clearInterval(intervalId);
    }

    function updatePath() {
        canvasContext.current?.lineTo(
            mousePosition.current.x,
            mousePosition.current.y
        );
        canvasContext.current?.stroke();
    }

    return (
        <DrawableContext.Provider value={{isDrawing, startDrawing, stopDrawing}}>
            <div onMouseMove={updateMousePosition} id="viewBoxParent">
                {children}
                <canvas id="canvas" width={'1000'} height={'1000'} style={{position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>

                </canvas>
            </div>
            
        </DrawableContext.Provider>
    )
}

export default Drawable