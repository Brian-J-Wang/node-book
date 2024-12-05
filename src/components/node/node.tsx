import { ActionTypes, NodeViewerContext, Position } from "../nodeviewer/nodeviewer"
import "./node.css"
import Draggable from "../../properties/draggable/draggable"
import { ReactNode, RefObject, useContext, useEffect, useRef, useState } from "react"
import { contextMenuContext } from "../contextMenu/ContextMenu"
import ContextMenuBuilder from "../contextMenuBuilder/contextMenuBuilder"
import createConnection from "../../assets/create-connection.svg"
import crossMark from "../../assets/cross.svg"
import { CollectionContext } from "../collection/Collection"
import { NodeProps, NodeType } from "./interfaces"
import ItemNode, { ItemNodeProps } from "./item-node/item-node"
import OriginNode from "./origin-node/origin-node"
import DetectOutOfBounds, { OutofBoundsHandle } from "../../properties/detectOutofBounds/detectOutOfBounds"
import { SideBarContext } from "../side-bar/sidebar"

export interface SharedNodeFunctions {
    onLeftMouse: () => void,
    getContextMenuItems: () => ReactNode,
    getSideBarItems: () => ReactNode
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
    const [outlineClasses, setOutlineClasses] = useState<string>("");
    const outlineClassesStateManager = useRef<NodeOutlineManager>(new NodeOutlineManager(setOutlineClasses))
    const collectionContext = useContext(CollectionContext);
    const childComponent = useRef<SharedNodeFunctions>({
        onLeftMouse: () => {},
        getContextMenuItems: () => undefined,
        getSideBarItems: () => undefined
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
    
    function openContext(evt: React.MouseEvent) {
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
        sidebarContext.openSideBar(childComponent.current?.getSideBarItems());
    }

    function unfocusNode() {
        setIsSelected(false);
        boundController.current?.setListen(false);
    }

    function handleDragEnd(position: Position) {
        collectionContext.updateNode({
            id: node.id,
            position: position
        })
    } 

    return (
        <DetectOutOfBounds ref={boundController} onOutOfBound={() => {
            unfocusNode();
        }} >
        <Draggable initialPosition={node.position} id={node.id} className="node" onDragEnd={handleDragEnd}>
                <div ref={boundingElement} className={outlineClasses} onClick={focusNode} onMouseDown={openContext} data-bounding-element>
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