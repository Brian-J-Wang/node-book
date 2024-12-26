import { generateObjectId } from "./uuidGen";

//need to implement connection type

type connectionType = "upstream" | "downstream" | "both"

type node = {
    id: string,
    connections: node[];
}

class Graph<props> {
    nodes: (node & props)[] = [];
    constructor() {

    }

    addNode(node: props): string {
        const combined = {
            ...node,
            id: generateObjectId(),
            connections: []
        };
        
        this.nodes.push(combined);

        return combined.id;
    }

    getNode(id: string) {
        const node = this.nodes.find((node) => node.id == id); 
        if (!node) {
            console.error("node was not found");
            return null;
        }

        return node;
    }

    removeNode(id: string) {
        this.nodes = this.nodes.filter((node) => {
            if (node.id == id) {
                return false;
            } else {
                return true;
            }
        })
    }

    addConnection(node1Id: string, node2Id: string) {
        const node1 = this.getNode(node1Id);
        const node2 = this.getNode(node2Id);
        
        if (node1 && node2) {
            node1.connections.push(node2);
            node2.connections.push(node1);
        }
    }

    removeConnection(node1Id: string, node2Id: string) {
        const node1 = this.getNode(node1Id);
        if (node1) {
            node1.connections = node1.connections.filter((connection) => {
                if (connection.id == node2Id) {
                    return false;
                } else {
                    return true;
                }
            })
        }

        const node2 = this.getNode(node2Id);
        if (node2) {
            node2.connections = node2.connections.filter((connection) => {
                if (connection.id == node1Id) {
                    return false;
                } else {
                    return true;
                }
            })
        }
    }

    getConnections(id: string, type: connectionType = "both") {
        const node = this.getNode(id);

        if (node) {
            const connections = node.connections.filter((connection) => {
                if (type = 'both') {
                    return true;
                }
            }).map((connection) => {
                return connection.id;
            })

            return connections;
        } else {
            return [];
        }
    }

    traverse(src: string, fn: (node: node & props) => boolean, direction: connectionType) {
        const queue = [ src ];

        while (queue.length != 0) {
            const id = queue.shift();
            if (!id) {
                break;
            }

            const node = this.getNode(id);   
            if (!node) {
                break;
            }

            if (fn(node)) {
                const connections = this.getConnections(id);
                queue.push( ...connections );
            }
        }
    }

    snapshot() {
        return [ ...this.nodes ];
    }
}