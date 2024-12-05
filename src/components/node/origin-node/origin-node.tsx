import { forwardRef, useCallback, useContext, useImperativeHandle } from "react"
import { NodeProps } from "../interfaces"
import "./origin-node.css"
import { SharedNodeFunctions } from "../node"
import { NodeEditorContext } from "../../nodeEditor/nodeEditor"

interface OriginNodeComponentProps {
    node: NodeProps
}

const OriginNode = forwardRef<SharedNodeFunctions, OriginNodeComponentProps>(({node}, ref) => {
    useImperativeHandle(ref, () => ({
        onLeftMouse: () => {},
        getContextMenuItems: () => <></>,
        getSideBarItems: () => (
        <>
            <h3 style={{margin: 0}}>The Start Node</h3>
            <p>
                This start node is where your path begins. From here you can plan out goals
                to achieve before reaching your final milestone.
            </p>
            <p>
                Right click on the canvas to place down a milestone. Then right click on any node to
                draw a connection. Connections always travel from the node you right clicked on to 
                the second node.
            </p>
            <p>
                The only rule for the nodes is that there must be a path that can be traced from the
                start node to the node.
            </p>
        </>)
    }))

    return (
        <div className="origin-node">           
            Start Here
        </div>
    )
})

export default OriginNode