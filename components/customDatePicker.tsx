import { useState } from "react"
import Datepicker from "react-tailwindcss-datepicker"; 
import { ArrowLeft, ArrowRight } from "phosphor-react"
import { DateValueType } from "react-tailwindcss-datepicker/dist/types";

interface DatePickerProps {
  onChange: (date: Date) => void;
	defauldDate?: Date | string
}

export function DatePicker({onChange, defauldDate = undefined}: DatePickerProps) {
	const [value, setValue] = useState<DateValueType>({ 
		startDate: defauldDate ?? null,
		endDate: defauldDate ?? null
	}); 

	const handleValueChange = (newValue: DateValueType) => {
		if(newValue?.startDate || newValue?.endDate) {
			setValue(newValue); 
			const date = newValue.startDate ? newValue.startDate : newValue.endDate
			onChange(new Date(date ?? ''))
		}
	} 

	return (
		<div>
			<Datepicker
				i18n={"en"} 
				minDate={new Date("1899-12-31")} 
				maxDate={new Date()} 
				startFrom={new Date("2000-01-01")} 
				useRange={false} 
				asSingle={true} 
				primaryColor={'violet'}
				value={value}
				onChange={handleValueChange} 
				inputClassName="w-full !px-3 !py-2 text-sm dark:font-light
				placeholder-gray-9 
				!ring-0
				!border !border-gray-12 
				rounded-md focus:!outline-none 
				focus:!ring-nexus-10 focus:!border-nexus-10
				dark:!bg-gray-2 dark:!text-gray-15 dark:!placeholder-gray-8 dark:!border-gray-5 
			 dark:focus:!ring-nexus-11 dark:focus:!border-nexus-11
			 "
			/>
		</div>
	)
}