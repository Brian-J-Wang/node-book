import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react"
import Edge, { EdgeProps } from "../edge/edge"
import { Position } from "../nodeviewer/nodeviewer"

import "./edgeRenderer.css"
import { CollectionContext } from "../collection/Collection"

export type edgeRendererHandle = {
    startDrawing: (startingPosition: Position) => void
    stopDrawing: () => void
}

type edgeRendererProps = {
}

const EdgeRenderer = forwardRef<edgeRendererHandle, edgeRendererProps>(({}, ref) => {
    const collection = useContext(CollectionContext);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [drawStart, setDrawStart] = useState<Position>({x: 0, y: 0});

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
    const [viewPortSize, setViewPortSize] = useState<Position>({
        x: window.innerWidth, 
        y: window.innerHeight});
        
    useEffect(() => {
        function updateViewPortSize() {
            setViewPortSize({
                x: window.innerWidth,
                y: window.innerHeight
            })
        }
        
        function updateMousePosition(evt: any) {
            setMousePosition({
                x: evt.clientX,
                y: evt.clientY
            });
        }

        document.addEventListener("mousemove", updateMousePosition);
        window.addEventListener('resize', updateViewPortSize);
        return () => {
            document.removeEventListener("mousemove", updateMousePosition);
            window.removeEventListener("resize", updateViewPortSize);
        }
    }, []);

    return(
        <svg className="edge-renderer" viewBox={`0 0 ${viewPortSize.x} ${viewPortSize.y}`}  width={viewPortSize.x} height={viewPortSize.y}>
            <defs>
                <marker id="arrow" 
                    markerWidth="15"
                    markerHeight="15"
                    markerUnits="userSpaceOnUse"
                    refX="6"
                    refY="8" 
                    orient="auto">
                    <path d="M14 8L2 2L5 8L2 14L14 8Z" fill="#292929" stroke="#292929"/>
                </marker>
            </defs>
            {isDrawing ? (
                <line x1={drawStart.x} y1={drawStart.y} x2={mousePosition.x} y2={mousePosition.y} className="edge-renderer__fake-line" markerEnd="url(#arrow)"/>
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