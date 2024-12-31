import { Node, Graph } from "../../../utils/graph";
import NodeObject from "../node-object";
import { validNodeMessage, validationMessage } from "../validation/nodeValidation";

function validateItemNode(_node: Node<NodeObject>, _graph: Graph<NodeObject>): validationMessage {    
    return validNodeMessage;
}

export default validateItemNode;