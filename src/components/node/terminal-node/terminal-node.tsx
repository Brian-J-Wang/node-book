import { ReactNode } from "react";
import { Position } from "../../../utils/math/position"
import { EdgeProps } from "../../edge/edge";
import NodeObject, { NodeObjectBuilder, nodeValidation } from "../node-object"
import NodeWrapper from "../node-wrapper"

class TerminalNodeObject extends NodeObject {
    constructor(position: Position, id?: string) {
        super(position, id);
    }

    getType(): string {
        return "terminal-node"
    }

    validate(nodes: NodeObject[], edges: EdgeProps[]): nodeValidation {
        return {
            isValid: true,
            message: ""
        }
    }

    getComponent(): ReactNode {
        return <TerminalNode node={this} key={this.id}/>
    }

    builder(): NodeObjectBuilder {
        return new TerminalNodeBuilder(this);
    }
}

class TerminalNodeBuilder extends NodeObjectBuilder {
    node: TerminalNodeObject;
    constructor(source: TerminalNodeObject) {
        super(source);
        this.node = new TerminalNodeObject({x: 0, y: 0});
        this.node = Object.assign(this.node, source);
    }
}

interface TerminalNodeProps {
    node: TerminalNodeObject
}
const TerminalNode = ({node}: TerminalNodeProps) => {
    const sideBar = (
        <>
            <h3 style={{margin: 0}}> The Terminal Node </h3>
            <p>
                The terminal is where your path ends. From here your efforts will
                be rewarded by png confetti that pops out when you complete all the nodes.
            </p>
        </>
    )

    return (
        <NodeWrapper node={node} 
        sidebar={sideBar} 
        contextMenu={undefined}>
            <div>This is a terminal Node</div>
        </NodeWrapper>
    )
}