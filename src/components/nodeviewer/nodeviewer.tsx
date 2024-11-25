import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import Node, { NodeProps } from "../node/node";
import "./nodeviewer.css"
import { contextMenuContext } from "../contextMenu/ContextMenu";
import ContextMenuBuilder from "../contextMenuBuilder/contextMenuBuilder";
import Draggable from "../../properties/draggable/draggable";
import { generateObjectId } from "../../utils/uuidGen";
import Drawable from "../../properties/drawable/drawable";

export interface Position {
    x: number;
    y: number;
}

export const nodeViewerContext = createContext<Position>({x: 0, y: 0});

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
    ])

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

    return (
        <Drawable>
            <Draggable preventDefault passDrag={setPosition} id="nodeViewer">
                {
                    nodes.map((node) => {
                        return (
                            <Node key={node.id} id={node.id} position={node.position} title={node.title} description={node.description} />
                        )
                    })
                }
                <div className='nv' onMouseDown={onMouseDown} id="nodeViewer"
                style={{backgroundPositionX: position.x, backgroundPositionY: position.y}}/>
            </Draggable>
        </Drawable>
        
    )
}

export default NodeViewer;