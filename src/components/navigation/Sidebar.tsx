import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import { INSIGHTS_ROUTE } from '../../constants/insightsConstants';

interface SidebarProps {
  onNavigate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const location = useLocation();

  const handleClick = () => {
    if (onNavigate) onNavigate();
  };

  return (
    <Box role="navigation" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar />
      <List component="nav">
        <ListItemButton
          component={NavLink}
          to={INSIGHTS_ROUTE}
          selected={location.pathname === INSIGHTS_ROUTE}
          onClick={handleClick}
        >
          <ListItemIcon>
            <InsightsIcon />
          </ListItemIcon>
          <ListItemText primary="Monthly Insights" />
        </ListItemButton>
      </List>
    </Box>
  );
};
