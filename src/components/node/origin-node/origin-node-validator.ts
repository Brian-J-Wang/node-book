import { Node, Graph} from "../../../utils/graph";
import NodeObject from "../node-object";

function validateOrginNode(tgt: Node<NodeObject>, _graph: Graph<NodeObject>): boolean {
    const upstreamConnections = tgt.getConnections("upstream");

    if (upstreamConnections.length != 0) {
        tgt.content.builder().validationObject({
            isValid: false,
            message: "Origin Node cannot have paths leading to it"
        });
        return false;
    }

    tgt.content.builder().validationObject({
        isValid: true,
        message: ""
    });
    return true;
}

export default validateOrginNode;