import React from "react";
import NodeObject, { ConnectionType } from "./node-object";

class NodeManager {
    dispatch: React.Dispatch<React.SetStateAction<NodeObject[]>>;
    nodes: NodeObject[];

    constructor(update?: React.Dispatch<React.SetStateAction<NodeObject[]>>, nodes?: NodeObject[]) {
        if (update) {
            this.dispatch = update
        } else {
            throw new Error("Not Implemented");
        }
        this.nodes = nodes ?? [];
        this.nodes.forEach((node) => {
            node.update = this.update.bind(this);
        })
    }

    addNode(node: NodeObject) {
        node.update = this.update.bind(this);
        this.nodes = [ ...this.nodes, node ];
        this.update();
    }
    
    //most interactions with the nodes is done though the node's id because there is no 
    //guarentee that the node will reference the same object.
    getNode(id: string) {
        const node = this.nodes.find((node) => node.id == id);

        if (node) {
            return node
        } else {
            throw new Error(`Queried node with id:${id} does not exist`);
        }
    }

    removeNode(id: string) {
        this.nodes = this.nodes.filter((node) => {
            if (node.id == id) {
                node.connections.forEach((connection) => {
                    this.removeConnection(connection.id, node.id);
                })
                return false;
            }
            return true;
        })
        this.update();
    }

    addConnection(src: string, tgt: string, type: ConnectionType) {
        const srcNode = this.getNode(src);
        const tgtNode = this.getNode(tgt);

        srcNode.connections.push({
            id: tgt,
            connectionType: type
        });

        tgtNode.connections.push({
            id: src,
            connectionType: type == "upstream" ? "downstream" : "upstream"
        });

        this.validate(srcNode);
        this.validate(tgtNode);
    }

    removeConnection(src1: string, src2: string) {
        const srcNode1 = this.getNode(src1);
        const srcNode2 = this.getNode(src2);

        srcNode1.connections = srcNode1.connections.filter((connection) => connection.id != src2);
        srcNode2.connections = srcNode2.connections.filter((connection) => connection.id != src1);

        this.validate(srcNode1);
        this.validate(srcNode2);
    }

    validate(node: NodeObject) {
        const validator = node.validator();
        const message = validator(node, this.nodes);

        node.builder().validationObject(message).complete();
    }

    //move through the graph and do an operation on the nodes starting from the source node, 
    //return a list of nodes that the function should move to. operation is BFS.
    //function will assume that nodes have been updated. It will not consider nodes that have already been visted;
    traverseGraph(src: string, fn: (node: NodeObject) => NodeObject[]) {
        const nodes = [ this.getNode(src) ];
        const visited: NodeObject[] = [];
        while (nodes.length != 0) {
            const currentNode = nodes.shift();
            if (!currentNode) {
                return;
            }

            nodes.push( ...fn(currentNode).filter((node) => !visited.includes(node)));
            visited.push(currentNode);
        }
    }

    forEach(fn: (node: NodeObject) => void) {
        this.nodes.forEach((node) => {
            fn(node);
        });

        return this;
    }

    update() {
        console.log("updating graph");
        this.dispatch([ ...this.nodes ]);
    }
}

export default NodeManager;