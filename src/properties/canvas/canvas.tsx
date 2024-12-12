import React, { createContext, RefObject, useContext, useEffect, useRef, useState } from "react"
import { Position } from "../../utils/math/position";
import "./canvas.css"
import { contextMenuContext } from "../../components/contextMenu/ContextMenu";
import ContextMenuBuilder from "../../components/contextMenuBuilder/contextMenuBuilder";
import { CollectionContext } from "../../components/collection/Collection";
import EdgeRenderer, { edgeRendererHandle } from "../../components/edgeRenderer/edgeRenderer";
import { NodeEditorContext } from "../../components/nodeEditor/nodeEditor";
import NodeRenderer from "../../components/nodeRenderer/nodeRenderer";
import { ItemNodeObject } from "../../components/node/item-node/item-node";

export enum ActionTypes {
    CreateEdges = "CreateEdges",
    DeleteEdges = "DeleteEdges"
}

type SpecialAction = {
    for: string
    type: ActionTypes,
    validTargets?: string[],
    invalidTargets?: string[]
}

type CanvasContext = {
    viewPortPosition: RefObject<Position>,
    canvasOffset: Position,
    drawConnection: (nodeId: string, type: ActionTypes) => void
}
// eslint-disable-next-line react-refresh/only-export-components
export const CanvasContext = createContext<CanvasContext>({
    viewPortPosition: {} as RefObject<Position>,
    canvasOffset: {x: 0, y: 0},
    drawConnection: () => {},
})

const DraggableCanvas = () => {
    const position = useRef<Position>({x: 0, y: 0});
    const dragAnchorPosition = useRef<Position>({x: 0, y: 0});
    const mouseAnchorPosition = useRef<Position>({x: 0, y: 0});
    const viewPortDimensions = useRef<Position>({x: 0, y: 0});
    const collection = useContext(CollectionContext);
    const dimensions = {x: 5000, y: 5000}

    useEffect(() => {
        const element = document.querySelector(".draggable-canvas");
        position.current = {
            x: (dimensions.x - window.innerWidth) / 2,
            y: (dimensions.y - window.innerHeight) / 2,
        }
        element?.scrollTo(position.current.x, position.current.y);
    }, [])

    useEffect(() => {
        const setViewportDimensions = () => {
            viewPortDimensions.current = {
                x: window.innerWidth,
                y: window.innerHeight
            }
        }

        window.addEventListener("resize", setViewportDimensions);
        setViewportDimensions();
        return () => {
            window.removeEventListener("resize", setViewportDimensions);
        }
    }, [])

    const handleDragStart = (evt: React.DragEvent<HTMLDivElement> ) => {
        if ((evt.target as HTMLDivElement).id != "draggable-canvas") {
            return;
        }

        evt.dataTransfer.setDragImage(new Image(), 0, 0);
        mouseAnchorPosition.current = {
            x: evt.clientX,
            y: evt.clientY
        }
        dragAnchorPosition.current = position.current;
    }

    const handleDrag = (evt: React.DragEvent<HTMLDivElement>) => {
        if ((evt.target as HTMLDivElement).id != "draggable-canvas") {
            return;
        }

        if (!evt.clientX || !evt.clientY) {
            return;
        }

        setPositionClamped(
            dragAnchorPosition.current.x + (mouseAnchorPosition.current.x - evt.clientX),
            dragAnchorPosition.current.y + (mouseAnchorPosition.current.y - evt.clientY)
        );

        (evt.target as HTMLDivElement).scrollTo(position.current.x, position.current.y);
    }

    const setPositionClamped = (x: number, y: number) => {
        if (x < 0) {
            x = 0;
        }
        if (x > dimensions.x - viewPortDimensions.current.x) {
            x = dimensions.x - viewPortDimensions.current.x;
        }
        if (y < 0) {
            y = 0;
        }
        if (y > dimensions.y - viewPortDimensions.current.y) {
            y = dimensions.y - viewPortDimensions.current.y;
        }

        position.current = {
            x: x,
            y: y
        }
    }

    
    //context menus stuff
    const contextMenu = useContext(contextMenuContext);
    const nodeViewerContextMenu = (
        <ContextMenuBuilder>
            <ContextMenuBuilder.CMOption 
                onClick={(evt) => {
                    const newPosition = {
                        x: evt.clientX + position.current.x,
                        y: evt.clientY + position.current.y
                    }
                    collection.nodeManager.addNode(new ItemNodeObject(newPosition));
                }}
                blurb="Add Node"
            />
        </ContextMenuBuilder>
    );

    //mouse button event handler
    const handleClick = (evt: React.MouseEvent) => {
        if (evt.button == 2) {
            contextMenu.openContext(nodeViewerContextMenu, {x: evt.nativeEvent.clientX, y: evt.nativeEvent.clientY});
        }
    }
    
    const edgeRendererController = useRef<edgeRendererHandle>() as RefObject<edgeRendererHandle>;
    const nodeEditorController = useContext(NodeEditorContext);
    const drawConnection = (src: string, actionType: ActionTypes) => {
        const rect = document.getElementById(src)?.getBoundingClientRect();
        if (rect) {
            edgeRendererController.current?.startDrawing({
                x: rect.x + (position.current.x) + (rect.width / 2),
                y: rect.y + (position.current.y) + (rect.height / 2)
            })
        }

        const srcNode = collection.nodeManager.getNode(src);

        const specialAction: SpecialAction = {
            for: src,
            type: actionType,
        };

        if (actionType == ActionTypes.CreateEdges) {
            collection.nodeManager.nodes.forEach((node) => {
                node.builder().specialOutline("constructive");
            })

            srcNode.connections.forEach((connection) => {
                collection.nodeManager.getNode(connection.id).builder().specialOutline('none');
            })

            collection.nodeManager.traverseGraph(src, (node) => {
                node.builder().specialOutline("none");                

                return node.connections
                    .filter((connection) => connection.connectionType == "upstream")
                    .map((connection) => collection.nodeManager.getNode(connection.id));
            });
            
            collection.nodeManager.update();
        } else if (actionType == ActionTypes.DeleteEdges) {
            srcNode.connections.forEach((connection) => {
                collection.nodeManager.getNode(connection.id).builder().specialOutline("destructive");
            })

            collection.nodeManager.update();
        }
        
        nodeEditorController.suppressEditor(true);
        document.addEventListener("click", handleMouseClick);
        document.addEventListener("keydown", handleKeyboardEscape);

        function handleKeyboardEscape(evt: KeyboardEvent) {
            if (evt.key == "Escape") {
                clearAction();
                edgeRendererController.current?.stopDrawing();
            }
        }

        function handleMouseClick(evt : MouseEvent) {
            evt.stopImmediatePropagation();

            const evtTarget = evt.target as Element;
            const tgt = evtTarget.closest(".node")?.id ?? null;
            if (!tgt || tgt == src) {
                return;
            }

            if (specialAction.type == ActionTypes.CreateEdges) {
                if (srcNode?.connections.some((connection) => connection.id == tgt)) {
                    return;
                }

                collection.nodeManager.addConnection(src, tgt, "downstream");
            }
            else if (specialAction.type == ActionTypes.DeleteEdges) {
                collection.nodeManager.removeConnection(src, tgt);
            }

            clearAction();
            edgeRendererController.current?.stopDrawing();   
        }

        function clearAction() {
            collection.nodeManager.nodes.forEach((node) => {
                node.builder().specialOutline("none");
            })
            collection.nodeManager.update();

            
            document.removeEventListener("click", handleMouseClick);
            document.removeEventListener("keydown", handleKeyboardEscape);
            nodeEditorController.suppressEditor(false);
        }
    }

    return (
        <CanvasContext.Provider value={{
                canvasOffset: {x: dimensions.x / 2, y: dimensions.y / 2}, 
                viewPortPosition: position,
                drawConnection: drawConnection
            }}>
            <div onDragStart={handleDragStart} onDrag={handleDrag} onMouseDown={handleClick} className="draggable-canvas" 
            id="draggable-canvas" draggable>
                <div style={{height: dimensions.y, width: dimensions.x}} className="draggable-canvas__dimension-element">
                    <NodeRenderer/>
                    <EdgeRenderer ref={edgeRendererController} />
                </div> 
            </div>
        </CanvasContext.Provider>
        
    )
}

export default DraggableCanvas;