import React, { PropsWithChildren, ReactNode } from "react"

import "./contextMenuBuilder.css"

type CMBProps = {
    children?: ReactNode
}

const ContextMenuBuilder = ({children, ...rest }: CMBProps) => {
    return (
        <div className="cmb__container">
            {children}
        </div>
    )
}

const CMOption : React.FC<{
    onClick: (evt: any) => void,
    blurb: string
}> = ({ onClick, blurb }) => {

    function handleMouseDown(evt : any) {
        onClick(evt);
    }

    return (
        <div onMouseDown={handleMouseDown} className="cmb__option">
            {blurb}
        </div>
    )
}

export default ContextMenuBuilder;

ContextMenuBuilder.CMOption = CMOption;

