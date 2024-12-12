import { ReactNode } from "react";
import { Position } from "../../utils/math/position";
import { generateObjectId } from "../../utils/uuidGen";

export type NodeValidationObject = {
    isValid: boolean,
    message: string
}

export type ConnectionType = "upstream" | "downstream"
type Connection = {
    id: string,
    connectionType: ConnectionType
}

export type SpecialOutline = "none" | "constructive" | "destructive" | "selected";
export default class NodeObject {
    id: string;
    position: Position;
    validationMessage: NodeValidationObject;
    connections: Connection[];
    specialOutline: SpecialOutline;
    update: () => void;

    constructor(position: Position, id?: string) {
        this.id = id ?? generateObjectId();
        this.position = position;
        this.validationMessage = {
            isValid: true,
            message: ""
        };
        this.connections = [];
        this.specialOutline = "none";
        this.update = (() => {});
    }

    getType(): string {
        return "node-object";
    }

    getComponent(): ReactNode {
        console.error("cannot call method on abstract class");
        return (<></>)
    }

    validate(): boolean {
        console.error("validate not set-up for abstract method");
        return true;
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

    validationObject(validationObject: NodeValidationObject) {
        this.node.validationMessage = validationObject;
        return this;
    }

    specialOutline(value: SpecialOutline) {
        this.node.specialOutline = value;
        return this;
    }

    connections(value: Connection) {
        const alreadyExists = this.node.connections.some((connection) => {
            connection.id = value.id
        });

        if ( alreadyExists ) {
            throw new Error("trying to add a connection that already existed");
        }

        this.node.connections.push(value);
        return this;
    }

    complete() {
        this.node.validate();
        this.update();
    }
}