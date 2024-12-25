import ItemNode from "../item-node/item-node";
import NodeObject from "../node-object";
import OriginNode from "../origin-node/origin-node";
import validateItemNode from "./item-node-validator";
import validateOrginNode from "./origin-node-validator";

export type nodeValidation = {
    isValid: boolean,
    message: string
}
export const validNode: nodeValidation = {
    isValid: true,
    message: ""
}

//validate node filters the node based on it's instance type
function validateNode(tgt: NodeObject, graph: NodeObject[]) {
    console.log(tgt);
    const validator = getNodeInstance(tgt);
    tgt.builder().validationObject(validator(tgt, graph)).complete();
}

function getNodeInstance(node: NodeObject): (tgt: NodeObject, graph: NodeObject[]) => nodeValidation {
    console.log(node);
    
    if (node instanceof OriginNode) {
        return validateOrginNode;
    } else if (node instanceof ItemNode) {
        return validateItemNode;
    } else {
        throw new Error("Node does not have recognizable instance");
    }
}

export default validateNode;