import { ReactNode } from "react"
import NodeWrapper from "../node-wrapper"
import NodeObject, { NodeObjectBuilder } from "../node-object"
import { Position } from "../../../utils/math/position"
import ValidationNotification from "../components/validation-notification"

import "./origin-node.css"
import "../../../assets/styles.css"
import validateOrginNode from "./origin-node-validator"
import { Node } from "../../../utils/graph"

export class OriginNodeObject extends NodeObject {
    constructor(position: Position) {
        super(position);
    }

    getType(): string {
        return "origin-node";
    }

    validator() {
        return validateOrginNode;
    }

    builder(): NodeObjectBuilder {
        return new OriginNodeBuilder(this, this.update);
    }
}

class OriginNodeBuilder extends NodeObjectBuilder {
    node: OriginNodeObject;
    constructor(source: OriginNodeObject, update: () => void) {
        super(source, update);
        this.node = source;
    }
}

interface OriginNodeProps {
    node: Node<OriginNodeObject>;
}

const OriginNode = ({node}: OriginNodeProps) => {
    const sideBar = (
        <>
            <h3 style={{margin: 0}}>The Start Node</h3>
            <p>
                This start node is where your path begins. From here you can plan out goals
                to achieve before reaching your final milestone.
            </p>
            <p>
                Right click on the canvas to place down a milestone. Then right click on any node to
                draw a connection. Connections always travel from the node you right clicked on to 
                the second node.
            </p>
            <p>
                The only rule for the nodes is that there must be a path that can be traced from the
                start node to the node.
            </p>
            <ValidationNotification validation={
                node.content.validationMessage
            }/>
        </>
    );

    const validationClass = (node.content.validationMessage.isValid)
    ? ""
    : "origin-node__invalid"

    return (
        <NodeWrapper 
            node={node} 
            sidebar={sideBar} 
            contextMenu={<></>}>
            <div className={"origin-node style__border " + validationClass}>           
                Start Here
            </div>
        </NodeWrapper>
        
    )
}

export default OriginNode