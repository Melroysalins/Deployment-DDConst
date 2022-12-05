import React from 'react';
import { TEProvider } from './context/context';
import TravelExpenses from './TravelExpenses';
import PropTypes from 'prop-types';

import './calendar.scss';

// components

import Page from 'components/Page';

export default function TELayout() {
  return (
    <TEProvider>
      <Page title="Travel expenses">
        <TravelExpenses />
      </Page>{' '}
    </TEProvider>
  );
}
