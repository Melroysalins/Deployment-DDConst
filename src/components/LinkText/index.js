import React from 'react';
import { Link } from '@mui/material';

const LinkText = ({ to, children }) => (
  <Link href={to} underline="always" color="text.primary" target="_blank" rel="noopener noreferrer">
    {children}
  </Link>
);

export default LinkText;