import { FC, ReactNode } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box className="min-h-screen bg-background text-text-primary flex flex-col">
      <AppBar position="static" color="transparent" elevation={0} className="border-b border-border-subtle bg-background">
        <Toolbar className="px-4 md:px-6">
          <Typography variant="h6" component="div" className="font-semibold tracking-tight">
            Spend Insights
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body2" className="text-text-secondary">
            Insights
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="main" className="flex-1 flex justify-center px-4 md:px-6 py-6">
        <Box className="w-full max-w-[1440px]">{children}</Box>
      </Box>
    </Box>
  );
};
