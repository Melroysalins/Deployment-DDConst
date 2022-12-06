import PropTypes from 'prop-types';
// @mui
import { Box } from '@mui/material';

// components
import MenuPopover from 'components/MenuPopover';

// ----------------------------------------------------------------------

Popup.propTypes = {
  variant: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  anchor: PropTypes.any,
};

export default function Popup(props) {
  const { variant = 'primary', anchor, handleClose } = props;

  return (
    <>
      <MenuPopover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={handleClose}
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Box
          sx={{
            height: '8px',
            background: (theme) => color(variant, theme),
          }}
        />
        {props.children}

        {/* <Stack flexDirection="row" justifyContent="space-between" sx={{ p: 1 }}>
          <Button
            startIcon={<Iconify icon="material-symbols:close-rounded" width={15} height={15} />}
            size="small"
            color="inherit"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            sx={{ color: (theme) => color(variant, theme) }}
            startIcon={<Iconify icon="ph:check-bold" width={15} height={15} />}
            size="small"
            onClick={handleSubmit}
          >
            Okay
          </Button>
        </Stack> */}
      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------

const color = (variant, theme) => {
  switch (variant) {
    case 'inherit':
      return theme.palette.colors[4];
    case 'primary':
      return theme.palette.colors[8];
    case 'secondary':
      return theme.palette.colors[6];
    default:
      return theme.palette.colors[0];
  }
};
