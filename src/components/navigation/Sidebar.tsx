import React from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { NavLink, useLocation } from 'react-router-dom';
import { INSIGHTS_ROUTE } from '../../constants/insightsConstants';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const isInsightsActive = location.pathname === INSIGHTS_ROUTE;

  return (
    <Box sx={{ height: '100%' }}>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          APB Demo
        </Typography>
      </Toolbar>
      <List>
        <NavLink to={INSIGHTS_ROUTE} style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItemButton selected={isInsightsActive}>
            <ListItemIcon sx={{ color: 'inherit' }}>
              <InsightsIcon />
            </ListItemIcon>
            <ListItemText primary="Monthly Insights" />
          </ListItemButton>
        </NavLink>
        <ListItemButton disabled>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Coming Soon" />
        </ListItemButton>
      </List>
    </Box>
  );
};
