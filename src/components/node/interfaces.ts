import { Position } from "../nodeviewer/nodeviewer";

export enum NodeType {
    origin,
    item,
    terminal
}

export interface NodeProps {
    id: string,
    type: NodeType,
    position: Position
}