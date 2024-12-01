import { forwardRef, useImperativeHandle } from "react"
import { NodeProps } from "../interfaces"
import "./origin-node.css"
import { SharedNodeFunctions } from "../node"

interface OriginNodeComponentProps {
    node: NodeProps
}

const OriginNode = forwardRef<SharedNodeFunctions, OriginNodeComponentProps>(({node}, ref) => {
    useImperativeHandle(ref, () => ({
        onLeftMouse: () => {},
        getContextMenuItems: () => <></>,
    }))

    return (
        <div className="origin-node">           
            Start Here
        </div>
    )
})

export default OriginNode