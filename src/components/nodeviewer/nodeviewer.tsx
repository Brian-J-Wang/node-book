import React, { createContext, useContext, useEffect, useState } from "react";
import Node, { NodeProps } from "../node/node";
import "./nodeviewer.css"
import { contextMenuContext } from "../contextMenu/ContextMenu";
import ContextMenuBuilder from "../contextMenuBuilder/contextMenuBuilder";
import Draggable from "../../properties/draggable/draggable";
import { generateObjectId } from "../../utils/uuidGen";
import Edge, { EdgeProps } from "../edge/edge";

export interface Position {
    x: number;
    y: number;
}

enum ActionTypes {
    OpenConnections = "OpenConnections"
}

type SpecialAction = {
    for: string
    type: ActionTypes
}

export const NodeViewerContext = createContext<{
    specialAction?: SpecialAction
    drawConnection: (nodeId: string) => void
    specialActionComplete: () => void
}>({
    specialAction: {
        for: "",
        type: ActionTypes.OpenConnections
    },
    drawConnection: () => {},
    specialActionComplete: () => {}
});

const NodeViewer : React.FC = () => {
    const [position, setPosition] = useState<Position>({x: 0, y: 0});
    const [nodes, setNodes] = useState<NodeProps[]>([
        {
            id: generateObjectId(),
            position: {x: 200, y: 200},
            title: "Finish This",
            description: "This is something that I need to do"
        },
        {
            id: generateObjectId(),
            position: {x: 200, y: 400},
            title: "Finish That",
            description: "This is also another thing that I need to do"
        },
        {
            id: generateObjectId(),
            position: {x: 200, y: 600},
            title: "Also Finish This",
            description: ""
        },
    ]);
    const [edges, setEdges] = useState<EdgeProps[]>([
        {
            startingNode: nodes[0].id,
            terminalNode: nodes[1].id
        },
        {
            startingNode: nodes[1].id,
            terminalNode: nodes[2].id
        }
    ])
    const [specialAction, setSpecialAction] = useState<SpecialAction | undefined>(undefined);
    

    const specialActionComplete = () => {
        setSpecialAction(undefined);
    }

    const contextMenu = useContext(contextMenuContext);
    const nodeViewerContextMenu = (
        <ContextMenuBuilder>
            <ContextMenuBuilder.CMOption 
                onClick={(evt) => {
                    setNodes([...nodes, {
                        id: generateObjectId(),
                        position: {x: evt.clientX, y: evt.clientY},
                        title: "Finish This",
                        description: "This is something that I need to do"
                    }])
                }}
                blurb="Add Node"
            />
            <ContextMenuBuilder.CMOption
                onClick={() => {
                    console.log("this is also clicked");
                }}
                blurb="Add Note"
            />
        </ContextMenuBuilder>
    );
    function onMouseDown(evt: any) {
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

    const [mousePosition, setMousePosition] = useState<Position>({x: 0, y: 0});
    const [viewPortSize, setViewPortSize] = useState<Position>({
        x: window.innerWidth, 
        y: window.innerHeight});
    const [pseudoLineStartPosition, setPseudoLineStartPosition] = useState<Position>({x: 0, y: 0});
    useEffect(() => {
        function updateViewPortSize(evt: any) {
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

    const drawConnection = (nodeId: string) => {
        const specialAction = {
            for: nodeId,
            type: ActionTypes.OpenConnections,
        }

        setSpecialAction(specialAction);

        document.addEventListener("click", handleMouseClick)

        const startNode = document.getElementById(nodeId);

        if (startNode) {
            const rect = startNode.getBoundingClientRect();
            setPseudoLineStartPosition({
                x: rect.x + (rect.width / 2),
                y: rect.y + (rect.height / 2)
            })
        }
        

        function handleMouseClick(evt : MouseEvent) {
            //@ts-ignore
            const terminalNode = evt.target.closest(".node").id;

            if (terminalNode) {
                setEdges([ ...edges, {
                    startingNode: nodeId,
                    terminalNode: terminalNode
                }])
            }
            

            setSpecialAction(undefined);

            document.removeEventListener("click", handleMouseClick);
        }
    }

    return (
        <Draggable preventDefault passDrag={setPosition} id="nodeViewer">
            <NodeViewerContext.Provider value={{specialAction, drawConnection, specialActionComplete}}>
                {
                    nodes.map((node) => {
                        return (
                            <Node key={node.id} id={node.id} position={node.position} title={node.title} description={node.description} />
                        )
                    })
                }
                <div className='nv' onMouseDown={onMouseDown} id="nodeViewer"
                style={{backgroundPositionX: position.x, backgroundPositionY: position.y}}/>
                <svg viewBox={`0 0 ${viewPortSize.x} ${viewPortSize.y}`}  width={viewPortSize.x} height={viewPortSize.y} style={{position: 'absolute', zIndex: -1, top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none'}}>
                    <line x1={pseudoLineStartPosition.x} y1={pseudoLineStartPosition.y} x2={mousePosition.x} y2={mousePosition.y} className="n__node-line" strokeWidth={0} id="pseudo-line"></line>
                    {
                        edges.map((edge) => {
                            return (
                                <Edge key={`${edge.startingNode}${edge.terminalNode}`}startingNode={edge.startingNode} terminalNode={edge.terminalNode} />
                            )
                        })
                    }
                </svg>
            </NodeViewerContext.Provider>
            
        </Draggable>
    )
}

export default NodeViewer;