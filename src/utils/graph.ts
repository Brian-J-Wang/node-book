import { generateObjectId } from "./uuidGen";

//need to implement connection type
type connection = {
    node: string,
    type: connectionType,
}
type connectionType = "upstream" | "downstream" | "both"

class Graph<props> {
    nodes = new Map<string, props>();
    connections = new Map<string, connection[]>();
    constructor() {

    }

    addNode(node: props): string {
        const id = generateObjectId();
        this.nodes.set(id, node);
        this.connections.set(id, []);

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
        this.connections.delete(id);
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

export default Graph;