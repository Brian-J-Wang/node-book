import { ReactNode } from "react"
import "./origin-node.css"
import NodeWrapper from "../node-wrapper"
import NodeObject, { NodeObjectBuilder, NodeValidationObject, } from "../node-object"
import { Position } from "../../../utils/math/position"
import { EdgeProps } from "../../edge/edge"
import ValidationNotification from "../components/validation-notification"

export class OriginNodeObject extends NodeObject {
    constructor(position: Position, id?: string) {
        super(position, id);
    }

    getType(): string {
        return "origin-node";
    }

    validate(nodes: NodeObject[], edges: EdgeProps[]): NodeValidationObject {
        //there cannot be more than two instances of it.
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].getType() == "origin-node" && nodes[i].id != this.id) {
                return {
                    isValid: false,
                    message: "Multiple copies of origin node is not allowed to exist."
                };
            }
        }

        //edges cannot lead to this node
        for (let i = 0; i < edges.length; i++) {
            if (edges[i].terminalNode == this.id) {
                return {
                    isValid: false,
                    message: "Origin node is not allowed to have paths leading to it."
                };
            }
        }

        return {
            isValid: true,
            message: ""
        }
    }

    getComponent(): ReactNode {
        return (
            <OriginNode node={this} key={this.id}/>
        );
    }

    builder(): NodeObjectBuilder {
        return new OriginNodeBuilder(this);
    }
}

class OriginNodeBuilder extends NodeObjectBuilder {
    node: OriginNodeObject;
    constructor(source: OriginNodeObject) {
        super(source);
        this.node = new OriginNodeObject({x: 0, y: 0});
        this.node = Object.assign(this.node, source);
    }
}

interface OriginNodeProps {
    node: OriginNodeObject;
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
                node.validationMessage
            }/>
        </>
    );

    const validationClass = (node.validationMessage.isValid)
    ? ""
    : "origin-node__invalid"

    return (
        <NodeWrapper 
            node={node} 
            sidebar={sideBar} 
            contextMenu={<></>}>
            <div className={"origin-node " + validationClass}>           
                Start Here
            </div>
        </NodeWrapper>
        
    )
}

export default OriginNode