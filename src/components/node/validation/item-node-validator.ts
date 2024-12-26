import NodeObject from "../node-object";
import { nodeValidation, validNode } from "./node-validation";

function validateItemNode(node: NodeObject, graph: NodeObject[]): nodeValidation {
    
    let upstream = new Set<NodeObject>();

    const queue = [ node ];
    while (queue.length != 0) {
        const current = queue.shift();

        const neighbors = current?.connections.filter((connection) => {
            if (connection.connectionType = "upstream") {
                return true;
            } else {
                return false;
            }
        })
    }
    


    return validNode;
}

export default validateItemNode;