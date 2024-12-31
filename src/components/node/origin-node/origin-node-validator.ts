import { Node, Graph} from "../../../utils/graph";
import NodeObject from "../node-object";
import { validationMessage, validNodeMessage } from "../validation/nodeValidation";

function validateOrginNode(tgt: Node<NodeObject>, _graph: Graph<NodeObject>): validationMessage {
    const upstreamConnections = tgt.getConnections("upstream");

    if (upstreamConnections.length != 0) {
        return {
            isValid: false,
            message: "Origin Node cannot have paths leading to it"
        }
    }

    return validNodeMessage;
}

export default validateOrginNode;