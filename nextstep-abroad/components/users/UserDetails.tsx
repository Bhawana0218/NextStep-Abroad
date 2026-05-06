"use client";

import Link from "next/link";
import { memo } from "react";
import {
  Avatar, Box, Button, Card, CardContent,
  Chip, Divider, Grid, Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CakeIcon from "@mui/icons-material/Cake";
import { User } from "@/types/user.types";
import { capitalize, genderColor } from "@/utils/helpers";

interface UserDetailsProps {
  user: User;
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2 }}>
      <Box sx={{ color: "primary.main", display: "flex", mt: 0.3 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {value || "—"}
        </Typography>
      </Box>
    </Box>
  );
}

function UserDetails({ user }: UserDetailsProps) {
  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Link href="/users" style={{ textDecoration: "none" }}>
          <Button startIcon={<ArrowBackIcon />} variant="outlined" size="small">
            Back to Users
          </Button>
        </Link>
      </Box>

      {/* Profile Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)",
          borderRadius: 3,
          p: { xs: 3, md: 4 },
          mb: 3,
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 3,
          flexWrap: "wrap",
        }}
      >
        <Avatar
          src={user.image}
          alt={`${user.firstName} ${user.lastName}`}
          sx={{ width: 100, height: 100, border: "4px solid rgba(255,255,255,0.5)" }}
        />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            @{user.username} · {user.email}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 1.5, flexWrap: "wrap" }}>
            <Chip label={capitalize(user.gender)} size="small" color={genderColor(user.gender)} sx={{ color: "white", fontWeight: 600 }} />
            <Chip label={`Age ${user.age}`} size="small" sx={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600 }} />
            <Chip label={user.bloodGroup} size="small" sx={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600 }} />
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" color="primary" gutterBottom sx={{ fontWeight: "bold" }}>
                Contact Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <InfoRow icon={<EmailIcon fontSize="small" />} label="Email" value={user.email} />
              <InfoRow icon={<PhoneIcon fontSize="small" />} label="Phone" value={user.phone} />
              <InfoRow icon={<CakeIcon fontSize="small" />} label="Date of Birth" value={user.birthDate} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" color="primary" gutterBottom sx={{ fontWeight: "bold" }}>
                Company Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <InfoRow icon={<BusinessIcon fontSize="small" />} label="Company" value={user.company?.name} />
              <InfoRow icon={<BusinessIcon fontSize="small" />} label="Department" value={user.company?.department} />
              <InfoRow icon={<BusinessIcon fontSize="small" />} label="Title" value={user.company?.title} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" color="primary" gutterBottom sx={{ fontWeight: "bold" }}>
                Address
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <InfoRow icon={<LocationOnIcon fontSize="small" />} label="Street" value={user.address?.address} />
              <InfoRow icon={<LocationOnIcon fontSize="small" />} label="City" value={user.address?.city} />
              <InfoRow icon={<LocationOnIcon fontSize="small" />} label="State" value={user.address?.state} />
              <InfoRow icon={<LocationOnIcon fontSize="small" />} label="Postal Code" value={user.address?.postalCode} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" color="primary" gutterBottom sx={{ fontWeight: "bold" }}>
                Physical Stats
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <InfoRow icon={<span style={{ fontSize: 16 }}>📏</span>} label="Height" value={`${user.height} cm`} />
              <InfoRow icon={<span style={{ fontSize: 16 }}>⚖️</span>} label="Weight" value={`${user.weight} kg`} />
              <InfoRow icon={<span style={{ fontSize: 16 }}>🩸</span>} label="Blood Group" value={user.bloodGroup} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default memo(UserDetails);
