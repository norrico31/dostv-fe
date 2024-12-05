import Select, { MultiValue } from 'react-select'
import { useThemeCtx } from "../contexts/DarkMode";

type Props = {
    options: OptionType[];
    selected: MultiValue<OptionType>;
    setSelected: (v: MultiValue<OptionType>) => void
    placeholder: string
    id: string
    key?: string
}

export default function MultiSelect({ id, options, selected, setSelected, placeholder, key }: Props) {
    const { theme } = useThemeCtx()
    return <Select<OptionType, true>
        placeholder={placeholder}
        className="rounded-md"
        styles={{
            control: (provided) => ({
                ...provided,
                backgroundColor: !theme ? '#fff' : 'rgb(79 88 100 / var(--tw-bg-opacity))',
            }),
            input: (provided) => ({
                ...provided,
                backgroundColor: !theme ? '#fff' : 'rgb(79 88 100 / var(--tw-bg-opacity))',
            }),
            menu: (provided) => ({
                ...provided,
                backgroundColor: !theme ? '#fff' : 'rgb(79 88 100 / var(--tw-bg-opacity))',
            }),
            option: (provided) => ({
                ...provided,
                backgroundColor: !theme ? '#fff' : 'rgb(79 88 100 / var(--tw-bg-opacity))',
                color: theme ? '#fff' : 'rgb(79 88 100 / var(--tw-bg-opacity))',
                // color: 'black',
                '&:hover': {
                    backgroundColor: 'darkgray',
                    // cursor: 'revert'
                },
            }),
        }}
        key={key}
        options={options}
        isMulti
        value={[...selected]}
        onChange={newVal => setSelected(newVal)}
        classNamePrefix="select"
        closeMenuOnSelect={false}
        id={id}
    />
}
