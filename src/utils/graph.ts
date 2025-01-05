import { generateObjectId } from "./uuidGen";

//need to implement connection type
type connection = {
    node: Node,
    type: connectionType,
}
export type connectionType = "upstream" | "downstream" | "both"

export class Node<T = any> {
    id: string = generateObjectId();
    connections: Map<string, connection> = new Map();
    content: T;
    constructor(content: T) {
        this.content = content;
    }

    addConnection(node: Node, type: connectionType) {
        if ( this.connections.has(node.id)) {
            console.error("Cannot add this connection, item already is connected");
        }

        this.connections.set(node.id, {
            node: node,
            type: type,
        })
    }

    hasConnection(id: string) {
        return this.connections.has(id);
    }
    
    getConnections(type: connectionType = "both") {
        const filteredConnections: connection[] = [];

        this.connections.forEach((connection) => {
            if (type == 'both') {
                filteredConnections.push(connection);
                return;
            } 

            if (connection.type == type) {
                filteredConnections.push(connection);
                return;
            }
        })

        return filteredConnections;
    }
    
    removeConnection(id: string) {
        const existed = this.connections.delete(id);

        if (!existed) {
            console.error("Trying to delete a connection that does not exist");
        }
    }
}

export class Graph<T> {
    nodes = new Map<string, Node<T>>();
    constructor() {}

    addNode(content: T): string {
        const newNode = new Node(content);
        this.nodes.set(newNode.id, newNode);

        return newNode.id;
    }

    getNode(id: string): Node {
        const node = this.nodes.get(id);

        if (node) {
            return node;
        } else {
            throw new Error("node does not exist");
        }
    }

    removeNode(id: string) {
        return this.nodes.delete(id);
    }

    addConnection(node1Id: string, node2Id: string): boolean {
        const node1 = this.getNode(node1Id);
        const node2 = this.getNode(node2Id);
        
        if (node1 && node2) {
            if (node1.hasConnection(node2Id) || node2.hasConnection(node1Id)) {
                console.error("trying to add a node that already exists");
                return false;
            }

            node1.addConnection(node2, "downstream");
            node2.addConnection(node1, "upstream");
            return true;
        } else {
            return false;
        }
    }

    removeConnection(node1Id: string, node2Id: string) {
        const node1 = this.getNode(node1Id);
        if (node1) {
            node1.removeConnection(node2Id);
        }

        const node2 = this.getNode(node2Id);
        if (node2) {
            node2.removeConnection(node1Id);
        }
    }

    traverse(src: string, fn: (node: Node<T>) => boolean, direction: connectionType = 'both') {
        const queue = [ src ];
        const visited = new Set<string>();

        while ( queue.length != 0 ) {
            const id = queue.shift() ?? "";
            if (visited.has(id)) {
                continue;
            }

            const node = this.getNode(id);
            if (!node) {
                break;
            }

            const propagate = fn(node);

            if (propagate) {
                node.getConnections(direction).forEach((connections) => {
                    queue.push(connections.node.id);
                })
            }
            visited.add(id);
        }
    }

    snapshot() {
        return Array.from(this.nodes.values());
    }
}