import { generateObjectId } from "./uuidGen";

//need to implement connection type
type connection = {
    node: node,
    type: connectionType,
}
type connectionType = "upstream" | "downstream" | "both"

type node = {
    id: string,
    connections: Map<string, connection>,
    [key: string]: any,
}

class Graph<props> {
    nodes = new Map<string, props & node>();
    constructor() {}

    addNode(node: props): string {
        const id = generateObjectId();
        const combined = {
            ...node,
            connections: new Map(),
            id: id
        }
        this.nodes.set(id, combined);

        return id;
    }

    getNode(id: string) {
        const node = this.nodes.get(id);

        if (node) {
            return node;
        } else {
            console.error("trying to get a node that does not exist");
        }
    }

    removeNode(id: string) {
        this.nodes.delete(id);
    }

    addConnection(node1Id: string, node2Id: string) {
        const node1 = this.getNode(node1Id);
        const node2 = this.getNode(node2Id);
        
        if (node1 && node2) {
            node1.connections.set(node2Id, {
                node: node2,
                type: "downstream"
            });

            node2.connections.set(node1Id, {
                node: node1,
                type: "upstream"
            })
        }
    }

    removeConnection(node1Id: string, node2Id: string) {
        const node1 = this.getNode(node1Id);
        if (node1) {
            deleteConnection(node1, node2Id);
        }

        const node2 = this.getNode(node2Id);
        if (node2) {
            deleteConnection(node2, node1Id);
        }

        function deleteConnection(node: node & props, id: string) {
            const exists = node.connections.delete(id);

            if (!exists) {
                console.error("connection does not exist!");
            }
        }
    }

    getConnections(id: string, type: connectionType = "both") {
        const node = this.getNode(id);

        if (node) {
            const neighbors: connection[] = [];

            node.connections.forEach((connection) => {
                if (type == "both") {
                    neighbors.push(connection);
                    return;
                }

                if (connection.type == type) {
                    neighbors.push(connection);
                }
            })

            return neighbors;
        } else {
            return [];
        }
    }

    // traverse(src: string, fn: (node: node & props) => boolean, direction: connectionType) {
    //     const queue = [ src ];

    //     while (queue.length != 0) {
    //         const id = queue.shift();
    //         if (!id) {
    //             break;
    //         }

    //         const node = this.getNode(id);   
    //         if (!node) {
    //             break;
    //         }

    //         if (fn(node)) {
    //             const connections = this.getConnections(id);
    //             queue.push( ...connections );
    //         }
    //     }
    // }

    snapshot() {
        return [ ...this.nodes ];
    }
}

export default Graph;