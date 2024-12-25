import NodeObject from "../node-object";
import { validNode, nodeValidation } from "./node-validation";

function validateOrginNode(tgt: NodeObject, _graph: NodeObject[]): nodeValidation {
    for (let i = 0; i < tgt.connections.length; i++) {
        const connection = tgt.connections[i];
        if (connection.connectionType == "upstream") {
            return {
                isValid: false,
                message: ""
            }
        }
    }

    return validNode;
}

export default validateOrginNode;