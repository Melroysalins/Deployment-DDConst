import { Button, FormHelperText, Stack } from '@mui/material'
import { useField } from 'formik'
import PropTypes from 'prop-types'

import Iconify from './Iconify'
import { useEffect, useState } from 'react'

// material
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

FileInput.propTypes = {
	sx: PropTypes.object,
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default function FileInput({ label, sx, name, height = 'auto' }) {
	const [field, meta, helpers] = useField(name)
	const [file, setFile] = useState(null)

	useEffect(() => {
		if (field.value) {
			const reader = new FileReader()

			reader.onloadend = () => {
				setFile(reader.result)
			}

			reader.readAsDataURL(field.value)
		} else {
			setFile(null)
		}
	}, [field])

	return (
		<Button sx={{ height }} variant="dashed" color="secondary" fullWidth component="label">
			{field?.value?.name ?? (
				<Stack direction="column" alignItems="center">
					<Iconify icon="ion:cloud-upload-outline" width={20} height={20} />
					{label}
				</Stack>
			)}
			<FormHelperText error={meta.touched && meta.error}>{meta.touched ? meta.error : null}</FormHelperText>
			<input
				type="file"
				hidden
				name={name}
				onChange={(e) => {
					helpers.setValue(e.currentTarget.files[0])
				}}
			/>
			{/* <img src={file} alt="sdf" className="img-thumbnail mt-2" height={200} width={200} /> */}
		</Button>
	)
}

// import PropTypes from 'prop-types'
// // material
// import { Button, FormHelperText, Popover, Stack } from '@mui/material'
// import { alpha, styled } from '@mui/material/styles'
// import Iconify from './Iconify'
// import { useField } from 'formik'
// import { useEffect, useState } from 'react'

// // ----------------------------------------------------------------------

// // ----------------------------------------------------------------------

// FileInput.propTypes = {
// 	sx: PropTypes.object,
// 	label: PropTypes.string.isRequired,
// 	name: PropTypes.string.isRequired,
// }

// export default function FileInput({ label, sx, name, ...props }) {
// 	const [field, meta, helpers] = useField(props)
// 	const [file, setFile] = useState(null)
// 	console.log(field)

// 	useEffect(() => {
// 		const reader = new FileReader()

// 		reader.onloadend = () => {
// 			setFile(reader.result)
// 		}

// 		reader.readAsDataURL(field.value)
// 	}, [field])

// 	return (
// 		<Button variant="dashed" color="secondary" fullWidth component="label">
// 			<Stack direction="column" alignItems="center">
// 				<Iconify icon="ion:cloud-upload-outline" width={20} height={20} />
// 				{label}
// 			</Stack>
// 			<FormHelperText error={meta.touched && meta.error}>{meta.touched ? meta.error : null}</FormHelperText>

// 			{/* <input type="file" hidden {...field} {...props} /> */}
// 			<input
// 				id={name}
// 				name={name}
// 				type="file"
// 				onChange={(event) => {
// 					helpers.setValue(name, event.currentTarget.files[0])
// 				}}
// 			/>
// 			{/* <img src={file} alt="adf" className="img-thumbnail mt-2" height={200} width={200} /> */}
// 		</Button>
// 	)
// }
