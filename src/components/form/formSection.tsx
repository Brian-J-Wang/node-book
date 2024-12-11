import { ReactNode } from "react";

import "./form.css"

type FormSectionProps = {
    children?: ReactNode
}

const FormSection = ({children}: FormSectionProps) => {    
    return (
        <div style={{display: "flex", flexDirection: "column"}} className="form__section" >
            {children}
        </div>
    )
}

export default FormSection;