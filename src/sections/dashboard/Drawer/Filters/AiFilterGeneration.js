import { Box, Button, Chip, FormControl, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { Form, Formik } from 'formik'
import { useState } from 'react'

export default function AiFilterGeneration({ onAiFilterResponseData, showFilterData }) {
	const [queryUsed, setQueryUsed] = useState('')
	const [errorMessage, setErrorMessage] = useState('')
	const [filters, setFilters] = useState({
		usedFilters: [],
		unUsedFilters: [
			'created_at',
			'title',
			'contract_code',
			'start',
			'end',
			'id',
			'location',
			'color',
			'branch',
			'contracted_source',
			'service',
			'voltage',
			'construction_type',
			'contract_value_vat',
			'contract_value_vat_written',
			'contract_value_price',
			'contract_value_price_written',
			'deposit_rate',
			'warranty_period',
			'compensation_rate',
			'adjustment_rate',
			'design_file',
			'blueprint_file',
			'contract_file',
		],
	})
	const filterConditions = ['equals', 'after', 'before', 'between', 'greater than', 'less than']
	const callApi = async (prompt) => {
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_AI_PROMPTING_URL}/generate-query`,
				{ prompt }
			)
			console.log('API Response:', response.data)
			setQueryUsed(response.data.query)
			setFilters(response.data.filters) // Update filters state from API response
			onAiFilterResponseData(response.data.result)
			setErrorMessage('')
		} catch (error) {
			setQueryUsed('')
			setErrorMessage('Please provide a valid prompt')
			console.error('API Error:', error)
		}
	}

	return (
		<Formik
			initialValues={{
				prompt: '', 
			}}
			onSubmit={async (values, { setSubmitting }) => {
				console.log('Submitted Values:', values.prompt)
				await callApi(values.prompt)
				setSubmitting(false)
			}}
		>
			{({ values, handleSubmit, handleChange, setFieldValue, isSubmitting }) => (
				<Form onSubmit={handleSubmit}>
					<Box display={'flex'} gap={1} alignItems={'center'}>
						<FormControl >
							<TextField
								label="AI Filter Prompt"
								multiline
								name="prompt"
								value={values.prompt}
								onChange={handleChange} 
								placeholder="Enter your prompt "
							/>
						</FormControl>
						<Box my={2}>
							<Button
								type="submit"
								variant="contained"
								color="primary"
								disabled={isSubmitting}
							>
								{isSubmitting ? 'Submitting...' : 'Submit'}
							</Button>
						</Box>
					</Box>
					{queryUsed && <Typography>DB Query Used: {queryUsed}</Typography>}
					{errorMessage && <Box color="red">{errorMessage}</Box>}

					{/* Filters Display */}
					{showFilterData && (
						<Box mt={3}>
							{filters.usedFilters?.length > 0 && (
								<>
									<Typography variant="h6">Used Filters</Typography>
									<Box display="flex" flexWrap="wrap" gap={1}>
										{filters.usedFilters?.map((filter) => (
											<Chip key={filter} label={filter} color="primary" />
										))}
									</Box>
								</>
							)}

							<Typography variant="h6">Conditions</Typography>
							<Box display="flex" flexWrap="wrap" gap={1}>
								{filterConditions?.map((filter) => (
									<Chip
										key={filter}
										label={filter}
										onClick={() => setFieldValue('prompt', values.prompt ? `${values.prompt} ${filter}` : filter)}
										clickable
										color="secondary"
									/>
								))}
							</Box>
							<Typography variant="h6" mt={2}>
								Available Filters
							</Typography>
							<Box display="flex" flexWrap="wrap" gap={1}>
								{filters.unUsedFilters?.map((filter) => (
									<Chip
										key={filter}
										label={filter}
										onClick={() => setFieldValue('prompt', values.prompt ? `${values.prompt} ${filter}` : filter)}
										clickable
										color="secondary"
									/>
								))}
							</Box>
						</Box>
					)}
				</Form>
			)}
		</Formik>
	)
}
