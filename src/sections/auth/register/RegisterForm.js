import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { supabase } from '../../../supabaseClient';
import useAlert from 'hooks/useAlert';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();
  const { ShowAlert, setmessage } = useAlert();
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation(['register'])

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (e) => {
    try {
      const { data, error } = await supabase.auth.signUp(e);
      if (error) throw error;
      else if (data.session && data.user) navigate('/dashboard/projects/list', { replace: true });
    } catch (error) {
      setmessage(error.error_description || error.message);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label={t('first_name')} />
          <RHFTextField name="lastName" label={t('last_name')} />
        </Stack>

        <RHFTextField name="email" label={t('email_address')} />

        <RHFTextField
          name="password"
          label={t('password')}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <ShowAlert />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          {t('register')}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
