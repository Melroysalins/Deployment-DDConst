import { Box, FormControl, TextField, Button } from '@mui/material';
import { Form, Formik } from 'formik';
import axios from 'axios';
import { useState } from 'react';

export default function AiFilterGeneration({onAiResponseData}) {

    const [queryUsed,setQueryUsed]=useState('')
    const [errorMessage,setErrorMessage]=useState('')
	const callApi = async (prompt) => {
		try {
			const response = await axios.post(`${process.env.REACT_APP_AI_PROMPTING_URL}/generate-query`, { prompt });
			console.log('API Response:', response.data);
            setQueryUsed(response.data.query)
            onAiResponseData(response.data.result)
            setErrorMessage('')
		} catch (error) {
            setQueryUsed('')
            setErrorMessage('please give me correct prompt')
			console.error('API Error:', error);
		}
	};

	return (
		<Formik
			initialValues={{
				prompt: '', // Define initial value for the form
			}}
			onSubmit={async (values, { setSubmitting }) => {
				console.log('Submitted Values:', values.prompt);
				await callApi(values.prompt); // Call API with the submitted prompt
				setSubmitting(false);
			}}
		>
			{({ values, handleSubmit, handleChange, isSubmitting }) => (
				<Form onSubmit={handleSubmit}>
					<Box>
						<FormControl fullWidth>
							<TextField
								id="outlined-multiline-static"
								label="AI Filter Prompt"
								multiline
								rows={4}
								name="prompt"
								value={values.prompt}
								onChange={handleChange} // Formik's handleChange automatically updates the value
								placeholder="Enter your prompt to filter data through AI"
							/>
						</FormControl>
						<Box my={2}>
							<Button
								type="submit"
								variant="contained"
								color="primary"
								disabled={isSubmitting} // Disable button while submitting
							>
								{isSubmitting ? 'Submitting...' : 'Submit'}
							</Button>
						</Box>
					</Box>
                    {queryUsed && <>
                    DB Query Used : {queryUsed}
                    </>}
                    {errorMessage &&<Box color={'red'}>
                        {errorMessage}</Box>}
				</Form>
			)}
		</Formik>
	);
}
