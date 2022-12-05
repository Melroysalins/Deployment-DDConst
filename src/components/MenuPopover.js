import PropTypes from 'prop-types';
// material
import { Popover } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

MenuPopover.propTypes = {
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
};

export default function MenuPopover({ children, sx, ...other }) {
  return (
    <Popover
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      PaperProps={{
        sx: {
          p: 1,
          width: 200,
          overflow: 'hidden',
          ...sx,
        },
      }}
      {...other}
    >
      {children}
    </Popover>
  );
}
