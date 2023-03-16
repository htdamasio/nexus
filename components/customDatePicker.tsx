import { useState } from "react"
import Datepicker from "tailwind-datepicker-react"
import { ArrowLeft, ArrowRight } from "phosphor-react"

const options = {
	autoHide: true,
	todayBtn: false,
	clearBtn: false,
	maxDate: new Date("2030-01-01"),
	minDate: new Date("1950-01-01"),
	theme: {
		background: "placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500",
		todayBtn: "",
		clearBtn: "",
		icons: "",
		text: "",
		disabledText: "",
		input: "",
		inputIcon: "",
		selected: "bg-indigo-500 hover:bg-indigo-600",
	},
	icons: {
		// () => ReactElement | JSX.Element
		prev: () => <ArrowLeft className="w5- h-5"/>,
		next: () => <ArrowRight className="w5- h-5"/>,
	},
	datepickerClassNames: "top-50",
	defaultDate: new Date(),
	language: "en",
}

interface DatePickerProps {
  onChange: (date: Date) => void;
}

export function DatePicker({onChange}: DatePickerProps) {
	const [show, setShow] = useState <boolean>(false)
	const handleChange = (selectedDate: Date) => {
		onChange(selectedDate)
	}
	const handleClose = (state: boolean) => {
		setShow(state)
	}

	return (
		<div>
			<Datepicker options={options} onChange={handleChange} show={show} setShow={handleClose} />
		</div>
	)
}