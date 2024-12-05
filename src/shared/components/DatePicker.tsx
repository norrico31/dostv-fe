import { useState } from 'react'
import Datepicker, { DateValueType, DateType } from 'react-tailwindcss-datepicker'

type Props = {
    value: DateType
    onChange: (v: string) => void
    isDisabledPreviousDates?: boolean
}

export default function DatePicker({ isDisabledPreviousDates, value, onChange }: Props) {
    const [state, setState] = useState<DateValueType>({ startDate: value, endDate: value })

    const handleDateChange = (v: DateValueType) => {
        setState(v)
        onChange(v?.startDate as string)
    }
    const getYesterdayDate = () => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    };

    const disabledDates = [
        {
            startDate: '2000-01-01', // some very old date
            endDate: getYesterdayDate(),
        },
    ];
    return <Datepicker
        displayFormat="MM/DD/YYYY"

        asSingle={true}
        useRange={false}
        disabledDates={isDisabledPreviousDates ? [] : disabledDates}
        value={state}
        onChange={handleDateChange}
        inputClassName='bg-gray-50 p-1.5 border border-gray-300 text-gray-900 text-md rounded-lg focus:border-blue-500 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500'
    />
}
