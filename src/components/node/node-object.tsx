import { ReactNode } from "react";
import { Position } from "../../utils/math/position";
import { generateObjectId } from "../../utils/uuidGen";

export type NodeValidationObject = {
    isValid: boolean,
    message: string
}

export const defaultNodeValidationObject: NodeValidationObject = {
    isValid: true,
    message: ""
}

export default class NodeObject {
    id: string;
    position: Position;
    validationMessage: NodeValidationObject;

    constructor(position: Position, id?: string) {
        this.id = id ?? generateObjectId();
        this.position = position;
        this.validationMessage = {
            isValid: true,
            message: ""
        }
    }

    getType(): string {
        return "node-object";
    }

    getComponent(): ReactNode {
        console.error("cannot call method on abstract class");
        return (<></>)
    }

    validate(nodes: any, edges: any): NodeValidationObject {
        console.error("validate not set-up for parent class");
        return defaultNodeValidationObject;
    }

    builder() {
        return new NodeObjectBuilder(this);
    }
}

export class NodeObjectBuilder {
    node: NodeObject;
    constructor(source: NodeObject) {
        this.node = new NodeObject({x: 0, y: 0});
        this.node = Object.assign(this.node, source);
    }

    position(newPosition: Position) {
        this.node.position = newPosition;
        return this;
    }

    validationObject(validationObject: NodeValidationObject) {
        this.node.validationMessage = validationObject;
        return this;
    }

    complete() {
        return this.node;
    }
}