const { forwardRef, useState, useRef, useEffect, useImperativeHandle } = require('react')

const DoublingEditor = forwardRef((props, ref) => {
	const [value, setValue] = useState(parseInt(props.value, 10))
	const refInput = useRef(null)

	useEffect(() => {
		// focus on the input
		refInput.current.focus()
	}, [])

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
			return value > 1000
		},
	}))

	return (
		<input
			type="number"
			step="0.1"
			ref={refInput}
			value={value}
			onChange={(event) => setValue(event.target.value)}
			style={{ width: '100%' }}
		/>
	)
})

export default DoublingEditor
