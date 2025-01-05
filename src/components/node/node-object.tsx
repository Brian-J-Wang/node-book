import { Position } from "../../utils/math/position";
import { Node, Graph } from "../../utils/graph";
import { validationMessage } from "./validation/nodeValidation";

export type SpecialOutline = "none" | "constructive" | "destructive" | "selected";
export default class NodeObject {
    position: Position;
    validationMessage: validationMessage;
    specialOutline: SpecialOutline;
    update: () => void;

    constructor(position: Position) {
        this.position = position;
        this.validationMessage = {
            isValid: true,
            message: ""
        };
        this.specialOutline = "none";
        this.update = (() => {});
    }

    getType(): string {
        return "node-object";
    }

    validator(): (node: Node<NodeObject>, graph: Graph<NodeObject>) => boolean {
        throw new Error("abstract method validator called");
    }

    builder() {
        const builder = new NodeObjectBuilder(this, this.update);
        return builder;
    }
}

export class NodeObjectBuilder {
    node: NodeObject;
    update: () => void;
    constructor(source: NodeObject, update: () => void) {
        this.node = source;
        this.update = update;
    }

    position(newPosition: Position) {
        this.node.position = newPosition;
        return this;
    }

    validationObject(validationObject: validationMessage) {
        this.node.validationMessage = validationObject;
        return this;
    }

    specialOutline(value: SpecialOutline) {
        this.node.specialOutline = value;
        return this;
    }

    complete() {
        this.update();
    }
}