import { forwardRef, ReactNode, useImperativeHandle } from "react";
import FormSection from "./formSection";
import MultiSelect from "./form-components/multi-select";
import TextField, { TextFieldProps } from "./form-components/text-field/text-field";
import { RadioSelect, RadioChoice } from "./form-components/radio-select/radio-select";

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
    TextField: React.FC<TextFieldProps>,
    MultiSelect: React.FC<any>,
    Section: React.FC<any>,
    RadioSelect: React.FC<any>,
    RadioSelectChoice: React.FC<any>,
}

const FormBuilder = Form as FormType;

FormBuilder.TextField = TextField;
FormBuilder.MultiSelect = MultiSelect;
FormBuilder.Section = FormSection;
FormBuilder.RadioSelect = RadioSelect;
FormBuilder.RadioSelectChoice = RadioChoice;

export default FormBuilder;