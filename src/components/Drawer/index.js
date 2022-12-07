import Drawer from '@mui/material/Drawer';
import './drawer.scss';
import MuiButton from '@mui/material/Button';
import Iconify from 'components/Iconify';

export default function TemporaryDrawer({
  anchor = 'right',
  headerIcon = '',
  open = false,
  setopen,
  header,
  children,
}) {
  const handleClose = () => {
    setopen(false);
  };

  return (
    <Drawer anchor={anchor} open={open} onClose={handleClose} className="customDrawer">
      {!!headerIcon && (
        <MuiButton
          onClick={handleClose}
          size="small"
          variant="contained"
          color="secondary"
          sx={{ padding: 1, minWidth: 0, position: 'absolute', left: -32, top: 5 }}
        >
          <Iconify icon={headerIcon} width={20} height={20} />
        </MuiButton>
      )}

      {!!header && <header>{header}</header>}
      <div className={`${header ? 'headerMargin' : ''} content`}>{children}</div>
    </Drawer>
  );
}
