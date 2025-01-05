import { Position } from "../../utils/math/position"
import "./node.css"
import Draggable from "../../properties/draggable/draggable"
import { ReactNode, RefObject, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import { contextMenuContext } from "../contextMenu/ContextMenu"
import ContextMenuBuilder from "../contextMenuBuilder/contextMenuBuilder"
import createConnection from "../../assets/create-connection.svg"
import crossMark from "../../assets/cross.svg"
import BoundingBox, { OutofBoundsHandle } from "../../properties/detectOutofBounds/boundingBox"
import { SideBarContext } from "../side-bar/sidebar"
import { ActionTypes, CanvasContext } from "../../properties/canvas/canvas"
import NodeObject, { SpecialOutline } from "./node-object"
import { CanvasModeContext } from "../canvas-mode/canvas-mode"
import { Node } from "../../utils/graph"

export interface SharedNodeFunctions {
    onLeftMouse: () => void,
    getContextMenuItems: () => ReactNode,
    getSideBarItems: () => ReactNode,
}

type NodeProps = {
    node: Node<NodeObject>,
    sidebar: ReactNode,
    contextMenu: ReactNode,
    children: ReactNode
}

const NodeWrapper : React.FC<NodeProps> = ({node, sidebar, contextMenu, children}) => {
    const [outlineClasses, setOutlineClasses] = useState<string>("");
    const outlineClassesStateManager = useRef<NodeOutlineManager>(new NodeOutlineManager(setOutlineClasses))
    const boundController = useRef<OutofBoundsHandle>() as RefObject<OutofBoundsHandle>;
    const canvasContext = useContext(CanvasContext);
    const canvasMode = useContext(CanvasModeContext);

    function handleDrawConnection(evt: React.MouseEvent) {
        evt.stopPropagation();
        canvasContext.drawConnection(node.id, ActionTypes.CreateEdges);
    }

    function handleDeleteConnection(evt: React.MouseEvent) {
        evt.stopPropagation();
        canvasContext.drawConnection(node.id, ActionTypes.DeleteEdges);
    }
    
    useEffect(() => {
        outlineClassesStateManager.current.setOutlineState(node.content.specialOutline);
    });

    const menuContext = useContext(contextMenuContext);
    const buildContextMenu = () => (
        <ContextMenuBuilder>
            <ContextMenuBuilder.CMOption image={createConnection} blurb="Create Connection" onClick={(evt) => {
                handleDrawConnection(evt);
            }}/>
            <ContextMenuBuilder.CMOption image={crossMark}blurb="Delete Connection" onClick={(evt) => {
                handleDeleteConnection(evt);
            }}/>
            {
                contextMenu
            }
        </ContextMenuBuilder>
    )
    
    function openContext(evt: React.MouseEvent) {     
        if (evt.button != 2) {
            return;
        }

        evt.stopPropagation();
        menuContext.openContext(buildContextMenu(), {
            x: evt.clientX,
            y: evt.clientY
        });
    }

    const sidebarContext = useContext(SideBarContext);
    function focusNode() {
        if (canvasMode.mode == "edit") {
            node.content.builder().specialOutline('selected').complete();
            boundController.current?.setListen(true);
            sidebarContext.openSideBar(sidebar);
        }
    }

    function unfocusNode() {
        node.content.builder().specialOutline('none').complete();
        boundController.current?.setListen(false);
    }

    function handleDragEnd(position: Position) {
        const newPosition = {
            x: position.x + (canvasContext.viewPortPosition.current?.x ?? 0),
            y: position.y + (canvasContext.viewPortPosition.current?.y ?? 0)
        };

        node.content.builder().position(newPosition).complete();
    }
    
    return (
        
        <Draggable initialPosition={node.content.position} id={node.id} className="node" onDragEnd={handleDragEnd}>
            <BoundingBox ref={boundController} onOutOfBound={() => {unfocusNode()}} >
                <div className={outlineClasses} onClick={focusNode} onMouseDown={openContext} data-bounding-element>
                    {children}
                </div>
            </BoundingBox>
        </Draggable>
    )
}

class NodeOutlineManager {
    stateFunction: (string: string) => void;
    baseString = "n__action-outline"

    constructor(stateFunction: React.Dispatch<SetStateAction<string>>) {
        this.stateFunction = stateFunction;
    }

    setOutlineState(state: SpecialOutline) {
        switch(state) {
            case "none":
                this.stateFunction(this.baseString);
                break;
            case "selected":
                this.stateFunction(this.baseString + " n__action-outline__selected");
                break;
            case "constructive":
                this.stateFunction(this.baseString + " n__action-outline__constructive");
                break;
            case "destructive":
                this.stateFunction(this.baseString + " n__action-outline__destructive");
                break;
        }
    }
}

export default NodeWrapper;