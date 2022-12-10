// @mui
import React from 'react';
import PropTypes from 'prop-types';

// components
import PopupForm from 'components/Popups/PopupForm';
import { AddTravelExpensesForm, AddSpecialTravelExpensesForm } from '../forms';

// ----------------------------------------------------------------------

AddFormPopup.propTypes = {
  handleClose: PropTypes.func.isRequired,
  employees: PropTypes.array.isRequired,
  anchor: PropTypes.any,
  type: PropTypes.oneOf(['ste', 'te', null]).isRequired,
};

const forms = {
  ste: {
    title: 'Add Special Travel Expenses',
    component: AddSpecialTravelExpensesForm,
  },
  te: {
    title: 'Add Travel Expenses',
    component: AddTravelExpensesForm,
  },
};

export default function AddFormPopup({ handleClose, anchor, type, employees, data }) {
  const ref = React.useRef();

  React.useEffect(() => {}, []);
  const Form = forms[type].component;

  const handleSubmit = () => {
    ref?.current?.onSubmit();
  };

  return (
    <>
      <PopupForm
        title={forms[type].title}
        variant="secondary"
        handleSubmit={handleSubmit}
        handleClose={handleClose}
        anchor={anchor}
      >
        <Form handleClose={handleClose} employees={employees} ref={ref} data={data} />
      </PopupForm>
    </>
  );
}
