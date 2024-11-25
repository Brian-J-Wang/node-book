import { Position } from "../nodeviewer/nodeviewer"
import "./node.css"
import Draggable from "../../properties/draggable/draggable"
import { useState } from "react"

export interface NodeProps {
    id: string,
    position: Position,
    title: string,
    description: string
}

const Node : React.FC<NodeProps> = ({position, title, description, id}) => {
    const [showPorts, setShowPort] = useState<boolean>(false);

    function handleMouseEnter() {
        setShowPort(true);
    }

    function handleMouseLeave() {
        setShowPort(false);
    }

    function handleDrag() {
        setShowPort(false);
    }

    function handleDraw() {
        
    }

    return (
        <Draggable className='n' initialPosition={position} id={id} passDrag={handleDrag}>
            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{position: 'relative'}}>
                <div className="n__header" >
                    <input type="checkbox" className="n__cb-input"/>
                    <h3 className="n__h3">{title}</h3>
                </div>
                {
                    (description != "") ? (
                        <div className="n__body">
                            <p className="n__p">{description ?? ''}</p>
                        </div>
                    ) : (
                        <></>
                    )
                }

                <Draggable.Prevent hidden={!showPorts}>
                    <div className="n__node-connection" style={{left: 'calc(50% - 4px)', bottom: -6}} onMouseDown={handleDraw}></div>
                    <div className="n__node-connection" style={{left: -5, bottom: 'calc(50% - 5px'}} onMouseDown={handleDraw}></div>
                    <div className="n__node-connection" style={{left: 'calc(50% - 4px)', top: -6}} onMouseDown={handleDraw}></div>
                    <div className="n__node-connection" style={{right: -5, bottom: 'calc(50% - 5px'}} onMouseDown={handleDraw}></div>
                </Draggable.Prevent>
                
            </div>
        </Draggable>
    )
}

export default Node;