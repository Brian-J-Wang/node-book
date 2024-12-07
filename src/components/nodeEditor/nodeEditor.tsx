import { createContext, ReactNode, RefObject, useRef, useState } from "react";

import "./nodeEditor.css"
import Form, { FormHandle } from "../form/form";
import { NodeProps } from "../node/interfaces";

import Button from "../shared/button/button";
import BoundingBox, { OutofBoundsHandle } from "../../properties/detectOutofBounds/boundingBox";

type NodeEditorProps = {
    children: ReactNode
}

export const NodeEditorContext = createContext<{
    suppressEditor: (suppress: boolean) => void
    openEditor: (title: string, props: NodeProps, onEditorClose: () => {}) => void
    activeNode: string,
}>({
    suppressEditor: () => {},
    openEditor: () => {},
    activeNode: ""
});

const NodeEditor = ({children} : NodeEditorProps) => {
    const [editorTitle, setEditorTitle] = useState<string>("");
    const [activeEditor, setActiveEditor] = useState<NodeProps | null>(null);
    const [activeNode, setActiveNode] = useState<string>("");
    const formRef = useRef<FormHandle | null>(null);
    const boundingElement = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>;
    const boundController = useRef<OutofBoundsHandle>() as RefObject<OutofBoundsHandle>;
    const suppressEditor = useRef<boolean>();
    const handleEditorClose = useRef<() => void>(() => {});

    const openEditor = (title: string, props: NodeProps, onEditorClose: () => void) => {
        if (suppressEditor.current) {
            return;
        }

        setEditorTitle(title);
        setActiveEditor(props);
        setActiveNode(props.id);
        handleEditorClose.current = onEditorClose
        boundController.current?.setListen(true);
    }

    const closeEditor = () => {
        setActiveEditor(null);
        setActiveNode("");
        if (formRef.current) {
            formRef.current.clearForm();
        }

        if (handleEditorClose.current) {
            handleEditorClose.current();
            handleEditorClose.current = () => {};
        }
        boundController.current?.setListen(false);
    }

    return (
        <NodeEditorContext.Provider value={{openEditor, activeNode, suppressEditor(suppress) {
            suppressEditor.current = suppress;
        },}} >
            {children}
            <BoundingBox ref={boundController} onOutOfBound={closeEditor}>
                <div ref={boundingElement} className="ne" id="nodeEditor" style={{visibility: (activeEditor == null) ? 'hidden' : 'visible'}}>
                    <div className="ne__header">
                        <h2 className="ne__blurb">{editorTitle}</h2>
                        <Button.Destructive onClick={closeEditor}></Button.Destructive>
                    </div>
                    <Form name={"nodeEditorForm"} ref={formRef}>
                        <Form.MultiSelect name="Tags"/>
                    </Form>
                </div>
            </BoundingBox>
        </NodeEditorContext.Provider>
    )
}

export default NodeEditor;