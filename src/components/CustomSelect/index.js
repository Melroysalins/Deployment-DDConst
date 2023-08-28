import React from 'react'
import { useTheme } from '@mui/material/styles'
import OutlinedInput from '@mui/material/OutlinedInput'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Iconify from 'components/Iconify'
import style from './select.module.scss'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
}

function getStyles(name, value, theme) {
	return {
		fontWeight: value.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
	}
}

export default function CustomSelect({
	label,
	value,
	handleChange,
	icon,
	multiple = true,
	disabled = false,
	data = [],
	size = 'medium',
	sx,
}) {
	const theme = useTheme()

	return (
		<FormControl sx={{ width: '100%', mt: 1, maxWidth: 400, ...sx }} size={size}>
			<Select
				multiple={multiple}
				disabled={disabled}
				displayEmpty
				value={value}
				onChange={handleChange}
				input={<OutlinedInput />}
				renderValue={(selected) => (
					<div className={style.contentSelect}>
						{!!icon && <Iconify icon={icon} sx={{ width: 18, height: 'auto' }} />}
						{multiple ? (
							<>
								<span className={style.text}>{label}</span>
								{selected.length > 0 && <span className={style.count}>{selected.length}</span>}
							</>
						) : (
							<span className={style.text}>{selected || label}</span>
						)}
					</div>
				)}
				MenuProps={MenuProps}
				inputProps={{ 'aria-label': 'Without label' }}
			>
				{data.map((name) => (
					<MenuItem key={name} value={name} style={getStyles(name, value, theme)}>
						{name}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	)
}
