"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar, Box, Button, Chip, Divider,
  Drawer, IconButton, Tooltip, Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import LogoutIcon from "@mui/icons-material/Logout";
import VerifiedIcon from "@mui/icons-material/Verified";
import SecurityIcon from "@mui/icons-material/Security";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import BarChartIcon from "@mui/icons-material/BarChart";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

import { useAuth } from "@/hooks/useAuth";

// ── Permissions the admin has ─────────────────────────────────────────────────
const PERMISSIONS = [
  { icon: <PeopleIcon sx={{ fontSize: 15 }} />, label: "Manage Users" },
  { icon: <ShoppingBagIcon sx={{ fontSize: 15 }} />, label: "Manage Products" },
  { icon: <BarChartIcon sx={{ fontSize: 15 }} />, label: "View Analytics" },
  { icon: <ManageAccountsIcon sx={{ fontSize: 15 }} />, label: "Admin Panel" },
  { icon: <SecurityIcon sx={{ fontSize: 15 }} />, label: "Security Settings" },
];

// ── Recent activity feed ──────────────────────────────────────────────────────
const ACTIVITY = [
  { action: "Logged into admin panel", time: "Just now", color: "#388e3c" },
  { action: "Viewed Users Management", time: "2 min ago", color: "#1976d2" },
  { action: "Browsed Products Catalog", time: "5 min ago", color: "#f57c00" },
  { action: "Checked Dashboard Analytics", time: "10 min ago", color: "#7b1fa2" },
];

export default function ProfileDrawer() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    setOpen(false);
    logout();
    router.push("/login");
  };

  if (!user) return null;

  const joinDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      {/* ── Avatar trigger ────────────────────────────────────────────────── */}
      <Tooltip title="My Profile" arrow>
        <Avatar
          src={user.image}
          alt={user.firstName}
          onClick={() => setOpen(true)}
          sx={{
            width: 38,
            height: 38,
            cursor: "pointer",
            border: "2px solid",
            borderColor: "primary.main",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "scale(1.1)",
              boxShadow: "0 0 0 3px rgba(25,118,210,0.25)",
            },
          }}
        />
      </Tooltip>

      {/* ── Drawer ────────────────────────────────────────────────────────── */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "100vw", sm: 400 },
              borderRadius: { sm: "16px 0 0 16px" },
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            },
          },
        }}
      >
        {/* ── Gradient Header ───────────────────────────────────────────── */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #0d47a1 0%, #1976d2 60%, #42a5f5 100%)",
            pt: 5, pb: 4, px: 3,
            position: "relative",
            textAlign: "center",
            color: "white",
            flexShrink: 0,
          }}
        >
          <IconButton
            onClick={() => setOpen(false)}
            size="small"
            sx={{
              position: "absolute", top: 12, right: 12,
              color: "white",
              backgroundColor: "rgba(255,255,255,0.15)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.25)" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          {/* Avatar with online indicator */}
          <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
            <Avatar
              src={user.image}
              alt={`${user.firstName} ${user.lastName}`}
              sx={{
                width: 96, height: 96,
                border: "4px solid rgba(255,255,255,0.7)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                mx: "auto",
              }}
            />
            {/* Online dot */}
            <Box
              sx={{
                position: "absolute", bottom: 4, right: 4,
                backgroundColor: "#4caf50",
                borderRadius: "50%",
                width: 22, height: 22,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid white",
              }}
            >
              <VerifiedIcon sx={{ fontSize: 13, color: "white" }} />
            </Box>
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.4 }}>
            @{user.username}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 1.5, flexWrap: "wrap" }}>
            <Chip
              label="Super Admin"
              size="small"
              icon={<AdminPanelSettingsIcon sx={{ fontSize: "14px !important", color: "white !important" }} />}
              sx={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white", fontWeight: 700, fontSize: 11 }}
            />
            <Chip
              label="● Online"
              size="small"
              sx={{ backgroundColor: "rgba(76,175,80,0.35)", color: "#a5d6a7", fontWeight: 700, fontSize: 11 }}
            />
          </Box>

          {/* Quick stats row */}
          <Box
            sx={{
              display: "flex", justifyContent: "center", gap: 0,
              mt: 3, mx: -3, mb: -4,
              backgroundColor: "rgba(0,0,0,0.15)",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {[
              { label: "Users", value: "208" },
              { label: "Products", value: "194" },
              { label: "Categories", value: "30" },
            ].map((s, i) => (
              <Box
                key={s.label}
                sx={{
                  flex: 1, py: 1.5, textAlign: "center",
                  borderRight: i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1 }}>{s.value}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.75 }}>{s.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ── Scrollable Body ───────────────────────────────────────────── */}
        <Box sx={{ overflowY: "auto", flex: 1, pb: 3 }}>

          {/* Account Details */}
          <Box sx={{ px: 3, pt: 3 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 1.5 }}>
              Account Details
            </Typography>

            {[
              { icon: <EmailIcon fontSize="small" />, label: "Email Address", value: user.email, bg: "#e3f2fd", color: "#1976d2" },
              { icon: <PersonIcon fontSize="small" />, label: "Username", value: `@${user.username}`, bg: "#f3e5f5", color: "#7b1fa2" },
              { icon: <BadgeIcon fontSize="small" />, label: "Account Type", value: "Super Administrator", bg: "#e8f5e9", color: "#388e3c" },
              { icon: <PhoneIcon fontSize="small" />, label: "User ID", value: `#${user.id?.toString().padStart(4, "0") ?? "0001"}`, bg: "#fff3e0", color: "#f57c00" },
              { icon: <LocationOnIcon fontSize="small" />, label: "Region", value: "Global Access", bg: "#fce4ec", color: "#c2185b" },
              { icon: <AccessTimeIcon fontSize="small" />, label: "Session Started", value: joinDate, bg: "#e0f7fa", color: "#0097a7" },
            ].map((row) => (
              <Box
                key={row.label}
                sx={{
                  display: "flex", alignItems: "center", gap: 2,
                  py: 1.4,
                  borderBottom: "1px solid", borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    width: 36, height: 36, borderRadius: 2,
                    backgroundColor: row.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: row.color, flexShrink: 0,
                  }}
                >
                  {row.icon}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1 }}>
                    {row.label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                    {row.value}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 2.5 }} />

          {/* Permissions */}
          <Box sx={{ px: 3 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 1.5 }}>
              Access Permissions
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1.5 }}>
              {PERMISSIONS.map((p) => (
                <Box
                  key={p.label}
                  sx={{
                    display: "flex", alignItems: "center", gap: 1.5,
                    p: 1.2, borderRadius: 2,
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 18, color: "#388e3c", flexShrink: 0 }} />
                  <Box sx={{ color: "#1976d2", display: "flex", alignItems: "center" }}>{p.icon}</Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{p.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 2.5 }} />

          {/* Recent Activity */}
          <Box sx={{ px: 3 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 1.5 }}>
              Recent Activity
            </Typography>
            <Box sx={{ mt: 1.5 }}>
              {ACTIVITY.map((a, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex", alignItems: "flex-start", gap: 1.5,
                    mb: 1.5, position: "relative",
                  }}
                >
                  {/* Timeline dot */}
                  <Box
                    sx={{
                      width: 10, height: 10, borderRadius: "50%",
                      backgroundColor: a.color,
                      mt: 0.6, flexShrink: 0,
                      boxShadow: `0 0 0 3px ${a.color}22`,
                    }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                      {a.action}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {a.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 2.5 }} />

          {/* Security Status */}
          <Box sx={{ px: 3 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 1.5 }}>
              Security Status
            </Typography>
            <Box
              sx={{
                mt: 1.5, p: 2, borderRadius: 2,
                background: "linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 100%)",
                border: "1px solid #c8e6c9",
              }}
            >
              {[
                { label: "Account Status", value: "Active", ok: true },
                { label: "Session", value: "Secure (HTTPS)", ok: true },
                { label: "Token", value: "Valid", ok: true },
                { label: "Last Login", value: "Today", ok: true },
              ].map((s) => (
                <Box key={s.label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.8 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {s.label}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CheckCircleIcon sx={{ fontSize: 13, color: "#388e3c" }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#2e7d32" }}>
                      {s.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Sign Out */}
          <Box sx={{ px: 3, mt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderRadius: 3, py: 1.3, fontWeight: 700,
                background: "linear-gradient(135deg, #c62828 0%, #e53935 100%)",
                "&:hover": { background: "linear-gradient(135deg, #b71c1c 0%, #c62828 100%)" },
              }}
            >
              Sign Out
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
