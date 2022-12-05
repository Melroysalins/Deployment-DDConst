// @mui
import React from 'react';
import PropTypes from 'prop-types';

// components
import PopupForm from 'components/Popups/PopupForm';
import { AddTravelExpensesForm, AddSpecialTravelExpensesForm } from '../forms';

// ----------------------------------------------------------------------

AddFormPopup.propTypes = {
  handleClose: PropTypes.func.isRequired,
  anchor: PropTypes.any,
  type: PropTypes.oneOf(['specialTe', 'te', null]).isRequired,
};

const forms = {
  specialTe: {
    title: 'Add Special Travel Expenses',
    component: AddSpecialTravelExpensesForm,
  },
  te: {
    title: 'Add Travel Expenses',
    component: AddTravelExpensesForm,
  },
};

export default function AddFormPopup({ handleClose, anchor, type }) {
  const ref = React.useRef();

  React.useEffect(() => {}, []);
  const Form = forms[type].component;

  return (
    <>
      <PopupForm
        title={forms[type].title}
        variant="secondary"
        handleSubmit={ref?.current?.handleSubmit}
        handleClose={handleClose}
        anchor={anchor}
      >
        <Form ref={ref} />
      </PopupForm>
    </>
  );
}
