import { Node, Graph } from "../../../utils/graph";
import NodeObject from "../node-object";

function validateItemNode(node: Node<NodeObject>, graph: Graph<NodeObject>): boolean {


    node.content.builder().validationObject({
        isValid: true,
        message: ""
    })
    return true;
}

export default validateItemNode;