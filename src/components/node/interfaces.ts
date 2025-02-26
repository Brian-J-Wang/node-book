import { Position } from "../../utils/math/position";

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