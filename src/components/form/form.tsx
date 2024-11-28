import { forwardRef, ReactNode, useImperativeHandle } from "react";
import FormSection from "./formSection";
import MultiSelect from "./form-components/MultiSelect";
import TextField from "./form-components/TextField";

type FormProps = {
    children: ReactNode,
    name: string,
}
export type FormHandle = {
    clearForm: () => void
}

const Form = forwardRef<FormHandle, FormProps>(({children, name}, ref) => {

    useImperativeHandle(ref, () => ({
        clearForm: () => {
            const form = document.forms[name as keyof typeof document.forms] as HTMLFormElement;
            form.reset();
        }
    }))

    return (
        <form name={name} style={{display: "flex", flexDirection: "column"}}>
            {children}
        </form>
    )
})

type FormType = React.ForwardRefExoticComponent<FormProps & React.RefAttributes<FormHandle>> & {
    TextField: React.FC<any>,
    MultiSelect: React.FC<any>,
    Section: React.FC<any>
}

const FormWithComponents = Form as FormType;

FormWithComponents.TextField = TextField;
FormWithComponents.MultiSelect = MultiSelect;
FormWithComponents.Section = FormSection;

export default FormWithComponents;