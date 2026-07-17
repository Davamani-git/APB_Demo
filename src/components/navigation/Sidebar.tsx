import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import { NavLink } from 'react-router-dom';
import { INSIGHTS_ROUTE } from '../../constants/insightsConstants';
import { dashboardLayoutStyles } from '../../layouts/DashboardLayout/DashboardLayout.styles';

export interface SidebarProps {
  variant: 'permanent' | 'temporary';
  open: boolean;
  onClose?: () => void;
  width?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ variant, open, onClose, width = 260 }) => {
  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          ...dashboardLayoutStyles.drawerPaper
        }
      }}
    >
      <Toolbar />
      <List>
        <ListItemButton
          component={NavLink}
          to={INSIGHTS_ROUTE}
          sx={{
            '&.active': {
              bgcolor: 'rgba(11, 114, 133, 0.08)',
              borderRight: '3px solid #0B7285'
            }
          }}
        >
          <ListItemIcon>
            <TimelineIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Monthly Insights" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
