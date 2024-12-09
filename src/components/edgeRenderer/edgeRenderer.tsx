import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react"
import Edge from "../edge/edge"
import { Position } from "../../utils/math/position"

import "./edgeRenderer.css"
import { CollectionContext } from "../collection/Collection"
import { CanvasContext } from "../../properties/canvas/canvas"

export type edgeRendererHandle = {
    startDrawing: (startingPosition: Position) => void
    stopDrawing: () => void
}

type edgeRendererProps = {
    edgeStyle?: string
}

const EdgeRenderer = forwardRef<edgeRendererHandle, edgeRendererProps>((props, ref) => {
    const collection = useContext(CollectionContext);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [drawStart, setDrawStart] = useState<Position>({x: 0, y: 0});
    const canvasContext = useContext(CanvasContext);

    useImperativeHandle(ref, () => ({
        startDrawing: (start) => {
            console.log("started Drawing");
            setIsDrawing(true);
            setDrawStart({
                x: start.x,
                y: start.y
            })
        },
        stopDrawing: () => {
            setIsDrawing(false);
        }
    }));

    const [mousePosition, setMousePosition] = useState<Position>({x: 0, y: 0});
        
    useEffect(() => {
        function updateMousePosition(evt: MouseEvent) {
            setMousePosition({
                x: evt.clientX,
                y: evt.clientY
            });
        }

        document.addEventListener("mousemove", updateMousePosition);
        return () => {
            document.removeEventListener("mousemove", updateMousePosition);
        }
    }, []);

    return(
        <svg className="edge-renderer" viewBox={`0 0 5000 5000`}  width={5000} height={5000}>
            <defs>
                <marker id="arrow" 
                    markerWidth="7"
                    markerHeight="8"
                    markerUnits="userSpaceOnUse"
                    refX="6"
                    refY="4" 
                    orient="auto">
                    <path d="M1 7V1L7 4L1 7Z" fill="#292929" stroke="#292929"/>
                </marker>
            </defs>
            {isDrawing ? (
                <line x1={drawStart.x} y1={drawStart.y} 
                    x2={mousePosition.x + (canvasContext.viewPortPosition.current?.x ?? 0)} 
                    y2={mousePosition.y + (canvasContext.viewPortPosition.current?.y ?? 0)} className="edge-renderer__fake-line" markerEnd="url(#arrow)"/>
            ) : (<></>)}
            {
                collection.edges.map((edge) => {
                    return (
                        <Edge key={`${edge.startingNode}${edge.terminalNode}`} startingNode={edge.startingNode} terminalNode={edge.terminalNode} marker="url(#arrow)"/>
                    )
                })
            }
        </svg>
    )
});

export default EdgeRenderer;