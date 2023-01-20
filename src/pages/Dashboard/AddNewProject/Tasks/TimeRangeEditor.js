const { Datepicker, Input, momentTimezone, setOptions } = require('@mobiscroll/react')
const { forwardRef, useState, useRef, useEffect, useImperativeHandle, useMemo } = require('react')
const moment = require('moment-timezone')

setOptions({
	theme: 'ios',
	themeVariant: 'light',
})

momentTimezone.moment = moment

const DoublingEditor = forwardRef((props, ref) => {
	const [value, setValue] = useState(props.value ?? null)
	const [instance, setInstance] = useState(null)
	const openPicker = useMemo(() => () => instance && instance.open(), [instance])
	useEffect(() => {
		// focus on the input
		// refInput.current.focus()
		openPicker()
	}, [openPicker])

	/* Component Editor Lifecycle methods */
	useImperativeHandle(ref, () => ({
		// the final value to send to the grid, on completion of editing
		getValue() {
			// this simple editor doubles any value entered into the input
			return value
		},

		// Gets called once before editing starts, to give editor a chance to
		// cancel the editing before it even starts.
		isCancelBeforeStart() {
			return false
		},

		// Gets called once when editing is finished (eg if Enter is pressed).
		// If you return true, then the result of the edit will be ignored.
		isCancelAfterEnd() {
			// our editor will reject any value greater than 1000
			return false
		},
	}))

	return (
		<>
			<Datepicker
				select="range"
				controls={['calendar']}
				touchUi={true}
				returnFormat="iso8601"
				dateFormat="DD/MM/YYYY"
				showRangeLabels={false}
				showOnFocus
				onChange={(event) => setValue(event.value)}
				value={value}
				ref={setInstance}
			/>
		</>
	)
})

export default DoublingEditor
