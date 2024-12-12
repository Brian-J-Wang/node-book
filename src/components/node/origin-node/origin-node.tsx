import { ReactNode } from "react"
import NodeWrapper from "../node-wrapper"
import NodeObject, { NodeObjectBuilder } from "../node-object"
import { Position } from "../../../utils/math/position"
import ValidationNotification from "../components/validation-notification"

import "./origin-node.css"
import "../../../assets/styles.css"

export class OriginNodeObject extends NodeObject {
    constructor(position: Position, id?: string) {
        super(position, id);
    }

    getType(): string {
        return "origin-node";
    }

    validate(): boolean {
        for (let i = 0; i < this.connections.length; i++) {
            const connection = this.connections[i];
            if (connection.connectionType == "upstream") {
                this.validationMessage = {
                    isValid: false,
                    message: "Origin node is not allowed to have paths leading to it."
                };

                return false;
            }
        }

        this.validationMessage = {
            isValid: true,
            message: ""
        }
        return true;
    }

    getComponent(): ReactNode {
        return (
            <OriginNode node={this} key={this.id}/>
        );
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
            <div className={"origin-node style__border " + validationClass}>           
                Start Here
            </div>
        </NodeWrapper>
        
    )
}

export default OriginNode