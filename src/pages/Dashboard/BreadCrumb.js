import * as React from 'react';
import { Breadcrumbs, Link, Stack, Menu, MenuItem, Typography } from '@mui/material';
import _ from 'lodash';
import { styled, alpha } from '@mui/material/styles';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';

export default function CustomSeparator({ selected }) {
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/dashboard/projects">
      Main
    </Link>,

    <CustomizedMenus option={selected} />,
  ];

  return (
    <Stack spacing={2}>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>
    </Stack>
  );
}

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

function CustomizedMenus({ option }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Typography
        display="flex"
        direction="row"
        alignItems="center"
        key="3"
        color="text.primary"
        label="Accessories"
        onClick={handleClick}
      >
        {_.startCase(option)}
        <KeyboardArrowDownIcon />
      </Typography>

      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem selected={option === 'addNewProject'} onClick={handleClose} disableRipple>
          <Link underline="hover" key="11" color="inherit" href="/dashboard/projects/add">
            Add new project
          </Link>
        </MenuItem>
        <MenuItem selected={option === 'projectsList'} onClick={handleClose} disableRipple>
          <Link underline="hover" key="12" color="inherit" href="/dashboard/projects/list">
            Projects list
          </Link>
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
