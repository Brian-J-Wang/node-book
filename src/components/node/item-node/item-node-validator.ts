import { Node, Graph } from "../../../utils/graph";
import NodeObject from "../node-object";

function validateItemNode(node: Node<NodeObject>, graph: Graph<NodeObject>): boolean {
    //connection is added before node is validated, therefore we can check upstream nodes
    //for whether the node being validated is connected.
    let invalidated = false;
    graph.traverse(node.id, (fnNode) => {
        if (invalidated) {
            return false;
        }

        const containSelf = fnNode.getConnections('upstream').some((connection) => connection.node.id == node.id);
        console.log(containSelf);
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