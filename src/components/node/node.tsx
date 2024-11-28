import { NodeViewerContext, Position } from "../nodeviewer/nodeviewer"
import "./node.css"
import Draggable from "../../properties/draggable/draggable"
import { useContext, useState } from "react"
import { NodeEditorContext } from "../nodeEditor/nodeEditor"
import createConnection from "../../assets/create-connection.svg"

export interface NodeProps {
    id: string,
    position: Position,
    title: string,
    description: string
    isComplete?: boolean
}

const Node : React.FC<NodeProps> = (props) => {
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const nodeEditorContext = useContext(NodeEditorContext)

    function openNodeEditor() {
        nodeEditorContext.openEditor(props);
    }

    function changeIsComplete() {
        setIsComplete(!isComplete);
    }

    const nodeViewerContext = useContext(NodeViewerContext);
    function handleDrawConnection(evt: React.MouseEvent) {
        evt.stopPropagation();
        console.log("this is clicked");
        nodeViewerContext.drawConnection(props.id);
    }

    function generateOutline() {

        let className = "n__action-outline"

        if (nodeViewerContext.specialAction != undefined && nodeViewerContext.specialAction.for != props.id) {
            className += " n__action-outline__valid-target";
        }

        return className
    }

    function shouldHideToolbar() {
        if (nodeEditorContext.activeNode != props.id) {
            return true;
        } else if (nodeViewerContext.specialAction != undefined) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <Draggable initialPosition={props.position} id={props.id} className="node">
            <div className={generateOutline()}>
                <div className={`n ${isComplete ? "n__state_complete": ""}`} style={{position: 'relative'}} onClick={openNodeEditor} id={props.id + "-node"}>
                    <div className="n__header">
                        <input type="checkbox" className="n__cb-input" onChange={changeIsComplete}/>
                        <h3 className="n__h3">{props.title}</h3>
                    </div>
                    {
                        (props.description != "" && !isComplete) ? (
                            <div className="n__body">
                                <p className="n__p">{props.description ?? ''}</p>
                            </div>
                        ) : (
                            <></>
                        )
                    }
                </div>
                <div className="n__toolbar" hidden={shouldHideToolbar()}>
                    <div className="n__toolbar-button-bar">
                        <button  className="n__buttons" onClick={handleDrawConnection}>
                            <img src={createConnection} alt="arrow" />
                        </button>
                    </div>
                </div>
            </div>
        </Draggable>
    )
}

export default Node;