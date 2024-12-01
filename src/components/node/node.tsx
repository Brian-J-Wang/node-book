import { ActionTypes, NodeViewerContext, Position } from "../nodeviewer/nodeviewer"
import "./node.css"
import Draggable from "../../properties/draggable/draggable"
import { MutableRefObject, ReactNode, RefObject, useContext, useEffect, useRef, useState } from "react"
import { NodeEditorContext } from "../nodeEditor/nodeEditor"
import { contextMenuContext } from "../contextMenu/ContextMenu"
import ContextMenuBuilder from "../contextMenuBuilder/contextMenuBuilder"
import createConnection from "../../assets/create-connection.svg"
import crossMark from "../../assets/cross.svg"
import { CollectionContext } from "../collection/Collection"
import { NodeProps, NodeType } from "./interfaces"
import ItemNode, { ItemNodeProps } from "./item-node/item-node"
import OriginNode from "./origin-node/origin-node"
import DetectOutOfBounds, { OutofBoundsHandle } from "../../properties/detectOutofBounds/detectOutOfBounds"

export interface SharedNodeFunctions {
    onLeftMouse: () => void,
    getContextMenuItems: () => ReactNode,
}

function NodeFactory(node: NodeProps, ref: RefObject<SharedNodeFunctions>): ReactNode  {
    if (node.type == NodeType.origin) {
        return <OriginNode ref={ref} node={node} />
    } else if (node.type == NodeType.item) {
        return <ItemNode ref={ref} node={node as ItemNodeProps}/>
    } else if (node.type == NodeType.terminal) {

    } else {
        return <></>
    }
}

const Node : React.FC<{
    node: NodeProps
}> = ({node}) => {
    const nodeEditorContext = useContext(NodeEditorContext);
    const [outlineClasses, setOutlineClasses] = useState<string>("");
    const outlineClassesStateManager = useRef<NodeOutlineManager>(new NodeOutlineManager(setOutlineClasses))
    const collectionContext = useContext(CollectionContext);
    const childComponent = useRef<SharedNodeFunctions>({
        onLeftMouse: () => {},
        getContextMenuItems: () => undefined
    }) as RefObject<SharedNodeFunctions>;
    const boundingElement = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>;
    const boundController = useRef<OutofBoundsHandle>() as RefObject<OutofBoundsHandle>;
    const [isSelected, setIsSelected] = useState<boolean>();

    const nodeViewerContext = useContext(NodeViewerContext);
    function handleDrawConnection(evt: React.MouseEvent) {
        evt.stopPropagation();
        nodeViewerContext.drawConnection(node.id, ActionTypes.CreateEdges);
    }

    function handleDeleteConnection(evt: React.MouseEvent) {
        evt.stopPropagation();
        nodeViewerContext.drawConnection(node.id, ActionTypes.DeleteEdges);
    }
    
    useEffect(() => {
    
        if (isSelected) {
            outlineClassesStateManager.current.setOutlineState(OutlineState.selected);
            return;
        }

        if (nodeViewerContext.specialAction == undefined || nodeViewerContext.specialAction.for == node.id) {
            outlineClassesStateManager.current.setOutlineState(OutlineState.none);
            return;
        }

        if (isValidTarget()) {
            if ((nodeViewerContext.specialAction.type === ActionTypes.CreateEdges)) {
                outlineClassesStateManager.current.setOutlineState(OutlineState.constructive);
                return;
            } else if ((nodeViewerContext.specialAction.type === ActionTypes.DeleteEdges)) {
                outlineClassesStateManager.current.setOutlineState(OutlineState.destructive);
                return;
            }
        }

        function isValidTarget() {
            if (nodeViewerContext.specialAction?.invalidTargets) {
                return !nodeViewerContext.specialAction.invalidTargets?.includes(node.id);
            } else if (nodeViewerContext.specialAction?.validTargets) {
                return nodeViewerContext.specialAction.validTargets?.includes(node.id);
            } else {
                return false;
            }
        }
    });

    useEffect(() => {
        if (isSelected) {
            outlineClassesStateManager.current.setOutlineState(OutlineState.selected);
        } else {
            return
        }
    }, [isSelected]);

    useEffect(() => {
        console.log(outlineClasses);
    }, [outlineClasses])
    //TODO: make this suck less
    function generateOutline() {
        let className = "n__action-outline"

        if (nodeViewerContext.specialAction == undefined || nodeViewerContext.specialAction.for == node.id) {
            return className;
        }

        if (isSelected) {
            className += " n__action-outline__selected";
        } else if (isValidTarget()) {
            if ((nodeViewerContext.specialAction.type === ActionTypes.CreateEdges)) {
                className += " n__action-outline__constructive";
            } else if ((nodeViewerContext.specialAction.type === ActionTypes.DeleteEdges)) {
                className += " n__action-outline__destructive";
            }
        }

        return className;

        //invalidTargets and validTargets are mutually exclusive.
        function isValidTarget() {
            if (nodeViewerContext.specialAction?.invalidTargets) {
                return !nodeViewerContext.specialAction.invalidTargets?.includes(node.id);
            } else if (nodeViewerContext.specialAction?.validTargets) {
                return nodeViewerContext.specialAction.validTargets?.includes(node.id);
            } else {
                return false;
            }
        }
    }

    const menuContext = useContext(contextMenuContext);
    const buildContextMenu = () => {
        const childComponentContextMenu = childComponent.current?.getContextMenuItems() ?? <></>; 
        const nodeContextMenu = (
            <ContextMenuBuilder>
                <ContextMenuBuilder.CMOption image={createConnection} blurb="Create Connection" onClick={(evt) => {
                    handleDrawConnection(evt);
                }}/>
                <ContextMenuBuilder.CMOption image={crossMark}blurb="Delete Connection" onClick={(evt) => {
                    handleDeleteConnection(evt);
                }}/>
                {
                    childComponentContextMenu
                }
            </ContextMenuBuilder>
        )

        return nodeContextMenu;
    }
    

    function handleMouseClick(evt: React.MouseEvent) {
        if (evt.button == 0) {
            setIsSelected(true);
            boundController.current?.setListen(true);
            childComponent.current?.onLeftMouse();
        } else if (evt.button == 2) {
            menuContext.openContext(buildContextMenu(), {
                x: evt.clientX,
                y: evt.clientY
            });
        }
    }

    function handleDragEnd(position: Position) {
        collectionContext.updateNode({
            id: node.id,
            position: position
        })
    } 

    return (
        <DetectOutOfBounds boundingElement={boundingElement} ref={boundController} onOutOfBound={() => {
            setIsSelected(false);
            boundController.current?.setListen(false);
        }} >
        <Draggable initialPosition={node.position} id={node.id} className="node" onDragEnd={handleDragEnd}>
                <div ref={boundingElement} className={outlineClasses} onMouseDown={handleMouseClick}>
                    {
                        NodeFactory(node, childComponent)
                    }
                </div>
        </Draggable>
        </DetectOutOfBounds>
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

export default Node;