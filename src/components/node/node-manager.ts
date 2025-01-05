import React from "react";
import NodeObject, { SpecialOutline } from "./node-object";
import { Node, Graph, connectionType} from "../../utils/graph";

class NodeManager {
    dispatch?: React.Dispatch<React.SetStateAction<Node<NodeObject>[]>>;
    graph = new Graph<NodeObject>();

    constructor(update?: React.Dispatch<React.SetStateAction<Node<NodeObject>[]>>, nodes?: NodeObject[]) {
        if (update) {
            this.dispatch = update
        } else {
            throw new Error("Not Implemented");
        }

        if (nodes) {
            nodes.forEach((node) => {
                this.addNode(node);
            })
        }
    }

    addNode(node: NodeObject) {
        node.update = this.update.bind(this);
        this.graph.addNode(node);
        this.update();
    }
    
    //most interactions with the nodes is done though the node's id because there is no 
    //guarentee that the node will reference the same object.
    getNode<T>(id: string) {
        return this.graph.getNode(id) as Node<T>;
    }

    removeNode(id: string) {
        const elementExisted = this.graph.removeNode(id);

        if (elementExisted) {
            this.update();
        }
    }

    addConnection(src: string, tgt: string) {
        this.graph.addConnection(src, tgt);

        this.validate(src);
        this.validate(tgt);
    }

    removeConnection(src1: string, src2: string) {
        this.graph.removeConnection(src1, src2);

        this.validate(src1);
        this.validate(src2);
    }

    validate(id: string) {
        const queue: Node<NodeObject>[] = [ this.graph.getNode(id) ];

        while (queue.length != 0 ) {
            const node = queue.shift();

            if (!node) {
                break;
            }

            const validator = node.content.validator();
            const isValid = validator(node, this.graph);

            if (!isValid) {
                queue.push( ...node.getConnections().map((item) => item.node));
            }
        }

        this.update();
    }

    forEach(fn: (node: Node<NodeObject>) => void){
        this.graph.nodes.forEach(fn);
    }

    setOutline(tgt: string, outline: SpecialOutline) {
        const node = this.getNode<NodeObject>(tgt);
        switch(outline) {
            case 'selected': 
                node.content.builder().specialOutline('selected').complete();
                break;
            case 'constructive':
                this.forEach((item) => {
                    item.content.builder().specialOutline('constructive');
                });

                node.getConnections().forEach((item) => {
                    item.node.content.builder().specialOutline('none');
                })

                this.graph.traverse(tgt, (item) => {
                    item.content.builder().specialOutline('none');
                    return true;
                }, 'upstream');

                this.update();
                break;
            case 'destructive':
                node.getConnections().forEach((connection) => {
                    (connection.node.content as NodeObject).builder().specialOutline('destructive');
                });

                this.update();
                break;
            case 'none':
                this.forEach((item) => {
                    if (item.content.specialOutline != 'none') {
                        item.content.builder().specialOutline('none');
                    }
                })
    
                this.update();
                break;
        }
    }

    update() {
        if (this.dispatch) {
            this.dispatch(this.graph.snapshot());
        }
    }
}


export default NodeManager;