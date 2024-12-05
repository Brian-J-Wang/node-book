import React, { createContext, RefObject, useContext, useEffect, useRef, useState } from "react";
import "./nodeviewer.css"
import { contextMenuContext } from "../contextMenu/ContextMenu";
import ContextMenuBuilder from "../contextMenuBuilder/contextMenuBuilder";
import Draggable from "../../properties/draggable/draggable";
import { generateObjectId } from "../../utils/uuidGen";
import { GlobalDragContext } from "../../properties/draggable/globalDragController";
import EdgeRenderer, { edgeRendererHandle } from "../edgeRenderer/edgeRenderer";
import { NodeEditorContext } from "../nodeEditor/nodeEditor";
import { CollectionContext } from "../collection/Collection";
import NodeRenderer from "../nodeRenderer/nodeRenderer";
import { NodeType } from "../node/interfaces";
import { ItemNodeProps, NodeColorCode } from "../node/item-node/item-node";

export interface Position {
    x: number;
    y: number;
}

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

export const NodeViewerContext = createContext<{
    specialAction?: SpecialAction
    drawConnection: (nodeId: string, type: ActionTypes) => void
    specialActionComplete: () => void
}>({
    specialAction: {
        for: "",
        type: ActionTypes.CreateEdges,
        validTargets: []
    },
    drawConnection: () => {},
    specialActionComplete: () => {}
});

const NodeViewer : React.FC = () => {
    const [position, setPosition] = useState<Position>({x: 0, y: 0});
    const [specialAction, setSpecialAction] = useState<SpecialAction | undefined>(undefined);
    const collection = useContext(CollectionContext);

    const specialActionComplete = () => {
        setSpecialAction(undefined);
    }

    const contextMenu = useContext(contextMenuContext);
    const nodeViewerContextMenu = (
        <ContextMenuBuilder>
            <ContextMenuBuilder.CMOption 
                onClick={(evt) => {
                    collection.addNode<ItemNodeProps>({
                        id: generateObjectId(),
                        type: NodeType.item,
                        position: { x: evt.clientX - position.x, y: evt.clientY - position.y },
                        isChecked: false,
                        title: "Untitled",
                        description: "No description",
                        colorCode: NodeColorCode.none
                    });
                }}
                blurb="Add Node"
            />
        </ContextMenuBuilder>
    );
    function openContext(evt: any) {
        if (evt.button === 2) {
            contextMenu.openContext(nodeViewerContextMenu, {x: evt.nativeEvent.clientX, y: evt.nativeEvent.clientY})
        }
    }

    //allows the use of a custom context menu
    useEffect(() => {
        function prevent(evt: any) {
            evt.preventDefault();
        }

        const nodeViewer = document.getElementById('nodeViewer');

        if (nodeViewer != null) {
            nodeViewer.addEventListener('contextmenu', prevent);

            return () => {
                nodeViewer.removeEventListener('contextmenu', prevent);
            }
        }
    }, []);

    const edgeRendererController = useRef<edgeRendererHandle>() as RefObject<edgeRendererHandle>;
    const globalDragController = useContext(GlobalDragContext);
    const nodeEditorController = useContext(NodeEditorContext);
    const drawConnection = (startNode: string, actionType: ActionTypes) => {
        const rect = document.getElementById(startNode)?.getBoundingClientRect();
        if (rect) {
            edgeRendererController.current?.startDrawing({
                x: rect.x + (rect.width / 2),
                y: rect.y + (rect.height / 2)
            })
        }

        let specialActionState: SpecialAction = {
            for: startNode,
            type: actionType,
        };
        if (actionType == ActionTypes.DeleteEdges) {
            specialActionState.validTargets = collection.getValidDeleteTargets(startNode);
        } else if (actionType == ActionTypes.CreateEdges) {
            specialActionState.invalidTargets = collection.getValidDeleteTargets(startNode);
        }
        setSpecialAction(specialActionState);
        
        
        nodeEditorController.suppressEditor(true);
        globalDragController.updateSuppress(true);
        document.addEventListener("click", handleMouseClick);
        document.addEventListener("keydown", handleKeyboardEscape);

        function handleKeyboardEscape(evt: KeyboardEvent) {
            console.log(evt);
            if (evt.key == "Escape") {
                clearAction();
                edgeRendererController.current?.stopDrawing();
            }
        }

        function handleMouseClick(evt : MouseEvent) {
            evt.stopImmediatePropagation();

            const evtTarget = evt.target as Element;
            const terminalNode = evtTarget.closest(".node")?.id ?? null;
            if (!terminalNode || terminalNode == startNode) {
                return;
            }

            console.log("handling state");

            if (specialActionState.type == ActionTypes.CreateEdges) {
                if (specialActionState.invalidTargets?.includes(terminalNode)) {
                    return;
                } else {
                    collection.addEdge({
                        startingNode: startNode,
                        terminalNode: terminalNode
                    });
                }
            } else if (specialActionState?.type == ActionTypes.DeleteEdges) {
                console.log('handling delete');
                if (specialActionState.validTargets?.includes(terminalNode)) {
                    collection.removeEdge(startNode, terminalNode);
                } else {
                    return;
                }
            }

            clearAction();
            edgeRendererController.current?.stopDrawing();   
        }

        function clearAction() {
            nodeEditorController.suppressEditor(false);
            globalDragController.updateSuppress(false);
            setSpecialAction(undefined);
            document.removeEventListener("click", handleMouseClick);
            document.removeEventListener("keydown", handleKeyboardEscape);
        }
    }

    return (
        <Draggable preventDefault onDrag={setPosition} id="nodeViewer">
            <NodeViewerContext.Provider value={{specialAction, drawConnection, specialActionComplete}}>
                <NodeRenderer/>
                <div className='nv' onMouseDown={openContext} id="nodeViewer"
                style={{backgroundPositionX: position.x, backgroundPositionY: position.y}}/>
                <EdgeRenderer ref={edgeRendererController} />
            </NodeViewerContext.Provider>
        </Draggable>
    )
}

export default NodeViewer;