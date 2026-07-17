import { styled } from '@mui/material/styles';
import { Box, Drawer, AppBar as MuiAppBar, AppBarProps as MuiAppBarProps } from '@mui/material';

const drawerWidth = 260;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
}));

export const DrawerStyled = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    borderRight: '1px solid',
    borderColor: theme.palette.divider,
  },
}));

export const Main = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

export const ContentWrapper = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: theme.spacing(8),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));
