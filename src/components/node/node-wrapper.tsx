import { Position } from "../../utils/math/position"
import "./node.css"
import Draggable from "../../properties/draggable/draggable"
import { ReactNode, RefObject, useContext, useEffect, useRef, useState } from "react"
import { contextMenuContext } from "../contextMenu/ContextMenu"
import ContextMenuBuilder from "../contextMenuBuilder/contextMenuBuilder"
import createConnection from "../../assets/create-connection.svg"
import crossMark from "../../assets/cross.svg"
import { CollectionContext } from "../collection/Collection"
import BoundingBox, { OutofBoundsHandle } from "../../properties/detectOutofBounds/boundingBox"
import { SideBarContext } from "../side-bar/sidebar"
import { ActionTypes, CanvasContext } from "../../properties/canvas/canvas"
import NodeObject from "./node-object"

export interface SharedNodeFunctions {
    onLeftMouse: () => void,
    getContextMenuItems: () => ReactNode,
    getSideBarItems: () => ReactNode,
}

type NodeProps = {
    node: NodeObject,
    sidebar: ReactNode,
    contextMenu: ReactNode,
    children: ReactNode
}

const NodeWrapper : React.FC<NodeProps> = ({node, sidebar, contextMenu, children}) => {
    const [outlineClasses, setOutlineClasses] = useState<string>("");
    const outlineClassesStateManager = useRef<NodeOutlineManager>(new NodeOutlineManager(setOutlineClasses))
    const collectionContext = useContext(CollectionContext);
    const boundController = useRef<OutofBoundsHandle>() as RefObject<OutofBoundsHandle>;
    const [isSelected, setIsSelected] = useState<boolean>();
    const canvasContext = useContext(CanvasContext);

    function handleDrawConnection(evt: React.MouseEvent) {
        evt.stopPropagation();
        canvasContext.drawConnection(node.id, ActionTypes.CreateEdges);
    }

    function handleDeleteConnection(evt: React.MouseEvent) {
        evt.stopPropagation();
        canvasContext.drawConnection(node.id, ActionTypes.DeleteEdges);
    }
    
    useEffect(() => {    
        if (isSelected) {
            outlineClassesStateManager.current.setOutlineState(OutlineState.selected);
            return;
        }

        if (canvasContext.specialAction == undefined || canvasContext.specialAction.for == node.id) {
            outlineClassesStateManager.current.setOutlineState(OutlineState.none);
            return;
        }

        if (isValidTarget()) {
            if ((canvasContext.specialAction.type === ActionTypes.CreateEdges)) {
                outlineClassesStateManager.current.setOutlineState(OutlineState.constructive);
                return;
            } else if ((canvasContext.specialAction.type === ActionTypes.DeleteEdges)) {
                outlineClassesStateManager.current.setOutlineState(OutlineState.destructive);
                return;
            }
        }

        function isValidTarget() {
            if (canvasContext.specialAction?.invalidTargets) {
                return !canvasContext.specialAction.invalidTargets?.includes(node.id);
            } else if (canvasContext.specialAction?.validTargets) {
                return canvasContext.specialAction.validTargets?.includes(node.id);
            } else {
                return false;
            }
        }
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
        evt.stopPropagation();
        if (evt.button != 2) {
            return;
        }

        menuContext.openContext(buildContextMenu(), {
            x: evt.clientX,
            y: evt.clientY
        });
    }

    const sidebarContext = useContext(SideBarContext);
    function focusNode() {
        setIsSelected(true);
        boundController.current?.setListen(true);
        sidebarContext.openSideBar(sidebar);
    }

    function unfocusNode() {
        setIsSelected(false);
        boundController.current?.setListen(false);
    }

    function handleDragEnd(position: Position) {
        const newPosition = {
            x: position.x + (canvasContext.viewPortPosition.current?.x ?? 0),
            y: position.y + (canvasContext.viewPortPosition.current?.y ?? 0)
        };

        collectionContext.updateNode(node.builder().position(newPosition).complete());
    }    

    return (
        
        <Draggable initialPosition={node.position} id={node.id} className="node" onDragEnd={handleDragEnd}>
            <BoundingBox ref={boundController} onOutOfBound={() => {unfocusNode()}} >
                <div className={outlineClasses} onClick={focusNode} onMouseDown={openContext} data-bounding-element>
                    {children}
                </div>
            </BoundingBox>
        </Draggable>
    )
}

enum OutlineState {
    none,
    selected,
    constructive,
    destructive
}

class NodeOutlineManager {
    stateFunction: (string: string) => void;
    baseString = "n__action-outline"

    constructor(stateFunction: React.Dispatch<any>) {
        this.stateFunction = stateFunction;
    }

    setOutlineState(state: OutlineState) {
        switch(state) {
            case OutlineState.none:
                this.stateFunction(this.baseString);
                break;
            case OutlineState.selected:
                this.stateFunction(this.baseString + " n__action-outline__selected");
                break;
            case OutlineState.constructive:
                this.stateFunction(this.baseString + " n__action-outline__constructive");
                break;
            case OutlineState.destructive:
                this.stateFunction(this.baseString + " n__action-outline__destructive");
                break;
        }
    }
}

export default NodeWrapper;