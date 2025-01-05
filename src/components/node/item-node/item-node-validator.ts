import { Node, Graph } from "../../../utils/graph";
import NodeObject from "../node-object";
import { OriginNodeObject } from "../origin-node/origin-node";
import { ItemNodeObject } from "./item-node";

function validateItemNode(node: Node<NodeObject>, graph: Graph<NodeObject>): boolean {
    //checks if this node is a valid frontier node, which requires all upstream nodes to be checked;
    const connections = node.getConnections('upstream');
    const checkable = connections.every((connection) => {
        if (connection.node.content instanceof OriginNodeObject) {
            return true;
        }

        if (connection.node.content instanceof ItemNodeObject) {
            return connection.node.content.checked;
        }

        return false;
    });
    (node.content as ItemNodeObject).builder().checkable(checkable);

    //connection is added before node is validated, therefore we can check upstream nodes
    //for whether the node being validated is connected.
    let invalidated = false;
    graph.traverse(node.id, (fnNode) => {
        if (invalidated) {
            return false;
        }

        const containSelf = fnNode.getConnections('upstream').some((connection) => connection.node.id == node.id);
        if (containSelf) {
            node.content.builder().validationObject({
                isValid: false,
                message: "node cannot connect to nodes that is upstream of it"
            });

            invalidated = true;
            return false;
        }

        return true;
    }, 'upstream');
    if (invalidated) {
        return false;
    }

    node.content.builder().validationObject({
        isValid: true,
        message: ""
    })
    return true;
}

export default validateItemNode;