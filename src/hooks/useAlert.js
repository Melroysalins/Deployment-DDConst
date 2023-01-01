import { Alert } from '@mui/material';
import React, { useEffect, useState } from 'react';

export default function useAlert() {
  const [message, setmessage] = useState('');

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setmessage('');
      }, 3000);
    }
  }, [message]);

  const ShowAlert = ({ severity = 'error' }) => (
    <>
      {message ? (
        <Alert style={{ marginTop: 10 }} severity={severity}>
          {message}
        </Alert>
      ) : (
        <></>
      )}
    </>
  );

  return {
    ShowAlert,
    message,
    setmessage,
  };
}
