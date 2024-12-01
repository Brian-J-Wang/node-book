import React, { ReactNode, useContext } from "react"

import "./contextMenuBuilder.css"
import { contextMenuContext } from "../contextMenu/ContextMenu"

type CMBProps = {
    children?: ReactNode
}

const ContextMenuBuilder = ({children}: CMBProps) => {
    return (
        <div className="cmb__container">
            {children}
        </div>
    )
}

type CMBOptionProps = {
    onClick: (evt: any) => void,
    blurb: string
    image?: string,
}

const CMOption : React.FC<CMBOptionProps> = ({ onClick, blurb, image }) => {
    const menuContext = useContext(contextMenuContext);

    function handleMouseDown(evt : any) {
        onClick(evt);
        menuContext.closeContext();
    }

    function resolveStyle() {
        return "cmb__item " + (image ? "cmb__option" : "cmb__option__style_no-image")
    }

    return (
        <div onMouseDown={handleMouseDown} className={resolveStyle()}>
            {image ? <img className="cmb__option-image" src={image} alt="image" /> : <></>}
            <p className="cmb__option-p">{blurb}</p>
        </div>
    )
}

const CMDivider : React.FC = () => {
    return (
        <hr className="cmb__divider"/>
    )
}

export default ContextMenuBuilder;

ContextMenuBuilder.Divider = CMDivider;
ContextMenuBuilder.CMOption = CMOption;

