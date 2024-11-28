import { createContext, ReactNode, useRef, useState } from "react";

import "./nodeEditor.css"
import Form, { FormHandle } from "../form/form";
import { NodeProps } from "../node/node";

import Button from "../shared/button/button";

type NodeEditorProps = {
    children: ReactNode
}

export const NodeEditorContext = createContext<{
    openEditor: (props: NodeProps) => void
    activeNode: string,
}>({
    openEditor: () => {},
    activeNode: ""
});


const NodeEditor = ({children} : NodeEditorProps) => {
    const [activeEditor, setActiveEditor] = useState<NodeProps | null>(null);
    const [activeNode, setActiveNode] = useState<string>("");
    const formRef = useRef<FormHandle | null>(null);

    const openEditor = (props: NodeProps) => {
        setActiveEditor(props);
        setActiveNode(props.id);
    }

    const closeEditor = () => {
        setActiveEditor(null);
        setActiveNode("");
        if (formRef.current) {
            formRef.current.clearForm();
        }
    }

    return (
        <NodeEditorContext.Provider value={{openEditor, activeNode}} >
            {children}
            <div className="ne" id="nodeEditor" style={{visibility: (activeEditor == null) ? 'hidden' : 'visible'}}>
                <div className="ne__header">
                    <h2 className="ne__blurb">{activeEditor?.title}</h2>
                    <Button.Destructive onClick={closeEditor}></Button.Destructive>
                </div>
                <Form name={"nodeEditorForm"} ref={formRef}>
                    <Form.Section>
                        <Form.MultiSelect name="Tags"/>
                        <Form.TextField placeholder="Add Text Here" initialValue={activeEditor?.description ?? "Enter value here"}/>
                    </Form.Section>
                </Form>
            </div>
        </NodeEditorContext.Provider>
    )
}

export default NodeEditor;