import "../form.css"

type MultiSelectProps = {
    name: string
}

const MultiSelect = ({name}: MultiSelectProps) => {
    return <div className="form__input form__multi-select">
        {`${name}:`}
    </div>
}

export default MultiSelect;