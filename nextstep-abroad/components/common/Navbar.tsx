"use client";

import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ProfileDrawer from "./ProfileDrawer";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "white",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar>
        {/* Mobile menu toggle */}
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: "none" } }}
          aria-label="open navigation menu"
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
          Help Study Abroad
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* Clicking the avatar opens the profile drawer */}
        <ProfileDrawer />
      </Toolbar>
    </AppBar>
  );
}
