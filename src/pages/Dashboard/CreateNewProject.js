// @mui
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Box, TextField, Typography, Button, Snackbar, Alert } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useFormik } from 'formik';
import moment from 'moment-timezone';
import * as Yup from 'yup';
// components
import Page from '../../components/Page';
// api
import { supabase } from 'lib/api';

// ----------------------------------------------------------------------
const validationSchema = Yup.object().shape({
  projectTitle: Yup.string().min(2, 'Too Short!').required('Required').nullable(),
  contractCode: Yup.string().min(2, 'Too Short!').required('Required').nullable(),
  contractValue: Yup.number().required('Required').nullable(),
  start: Yup.date().required('Required').nullable(),
  end: Yup.date().required('Required').nullable(),
});

const initialValues = {
  projectTitle: null,
  contractCode: null,
  contractValue: null,
  start: null,
  end: null,
};

export default function CreateNewProject() {
  const theme = useTheme();
  const [loader, setLoader] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const { handleSubmit, errors, touched, handleChange, handleBlur, values, setFieldValue } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setLoader(true);
      const res = await supabase.from('projects').insert([values]);
      console.log(res);
      if (res.status === 201) {
        setToast({ severity: 'success', message: 'Succesfully added new project!' });
      } else {
        setToast({ severity: 'error', message: 'Failed to added new project!' });
      }
      setLoader(false);
    },
  });

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: projects, error } = await supabase.from('projects').select('*');
    console.log(projects, error);
  };
  const handleClose = (event, reason) => {
    setToast(null);
  };
  return (
    <Page title="Add New Project">
      <Snackbar
        open={toast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={toast?.severity} sx={{ width: '100%' }}>
          {toast?.message}
        </Alert>
      </Snackbar>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box
              sx={{ backgroundColor: theme.palette.background.paper, borderRadius: 2 }}
              onSubmit={handleSubmit}
              component="form"
              noValidate
              autoComplete="off"
              p={3}
            >
              <Typography gutterBottom variant="subtitle1" mb={2}>
                Basic Info
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={6}>
                  <TextField
                    error={errors.projectTitle && touched.projectTitle}
                    helperText={errors.projectTitle && touched.projectTitle ? errors.projectTitle : null}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="projectTitle"
                    value={values.projectTitle}
                    fullWidth
                    id="outlined-textarea"
                    label="Project title"
                    placeholder=""
                    multiline
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={3}>
                  <TextField
                    error={errors.contractCode && touched.contractCode}
                    helperText={errors.contractCode && touched.contractCode ? errors.contractCode : null}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="contractCode"
                    value={values.contractCode}
                    fullWidth
                    id="outlined-textarea"
                    label="Contract Code"
                    placeholder=""
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={3}>
                  <TextField
                    error={errors.contractValue && touched.contractValue}
                    helperText={errors.contractValue && touched.contractValue ? errors.contractValue : null}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="contractValue"
                    value={values.contractValue}
                    fullWidth
                    id="outlined-textarea"
                    label="Contract Value"
                    placeholder=""
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={3}>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat="YYYY-MM-DD"
                      error={errors.start && touched.start}
                      helperText={errors.start && touched.start ? errors.start : null}
                      onChange={(newValue) => {
                        const date = moment(newValue).format('YYYY-MM-DD');
                        setFieldValue('start', date);
                      }}
                      onBlur={handleBlur}
                      value={values.start}
                      name="start"
                      fullWidth
                      id="outlined-textarea"
                      label="Start"
                      placeholder=""
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={12} lg={3}>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat="YYYY-MM-DD"
                      error={errors.end && touched.end}
                      helperText={errors.end && touched.end ? errors.end : null}
                      onChange={(newValue) => {
                        const date = moment(newValue).format('YYYY-MM-DD');
                        setFieldValue('end', date);
                      }}
                      onBlur={handleBlur}
                      value={values.end}
                      name="end"
                      fullWidth
                      id="outlined-textarea"
                      label="End"
                      placeholder=""
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    type="submit"
                    sx={{
                      color: theme.palette.text.default,
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.04)',
                      borderRadius: '8px',
                    }}
                  >
                    {loader ? <CircularProgress size={17} fontSize="inherit" /> : 'Submit'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
