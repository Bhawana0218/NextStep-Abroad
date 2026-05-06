"use client";

import {
  Box, Divider, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Typography, Button, Avatar,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { SIDEBAR_LINKS } from "@/utils/constants";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const DRAWER_WIDTH = 240;

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>

      {/* Brand */}
      <Box sx={{ p: 3, background: "linear-gradient(135deg, #1565c0 0%, #1976d2 100%)", color: "white" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>Admin Panel</Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>Help Study Abroad</Typography>
      </Box>

      {/* User info */}
      {user && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 2, borderBottom: "1px solid", borderColor: "divider" }}>
          <Avatar src={user.image} sx={{ width: 36, height: 36 }} />
          <Box sx={{ overflow: "hidden" }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user.email}
            </Typography>
          </Box>
        </Box>
      )}

      <Divider />

      {/* Nav links */}
      <List sx={{ flex: 1, pt: 1 }}>
        {SIDEBAR_LINKS.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path !== "/dashboard" && pathname.startsWith(item.path));

          return (
            <ListItemButton
              key={item.title}
              onClick={() => handleNavigate(item.path)}
              sx={{
                mx: 1, mb: 0.5, borderRadius: 2,
                backgroundColor: isActive ? "primary.main" : "transparent",
                color: isActive ? "white" : "text.primary",
                "&:hover": { backgroundColor: isActive ? "primary.dark" : "action.hover" },
              }}
            >
              <ListItemIcon sx={{ color: isActive ? "white" : "text.secondary", minWidth: 40 }}>
                <item.icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                slotProps={{
                  primary: {
                    sx: {
                      fontWeight: isActive ? 600 : 400,
                      fontSize: "0.9rem",
                    },
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Logout */}
      <Box sx={{ p: 2 }}>
        <Button variant="outlined" color="error" fullWidth onClick={handleLogout} sx={{ borderRadius: 2 }}>
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
