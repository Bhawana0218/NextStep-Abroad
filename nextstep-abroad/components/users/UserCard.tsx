"use client";

import Link from "next/link";
import { memo } from "react";
import { Avatar, Box, Card, CardContent, Chip, Typography } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import { User } from "@/types/user.types";
import { capitalize, genderColor } from "@/utils/helpers";

interface UserCardProps {
  user: User;
}

function UserCard({ user }: UserCardProps) {
  return (
    <Link href={`/users/${user.id}`} style={{ textDecoration: "none", display: "block" }}>
      <Card
        sx={{
          borderRadius: 3,
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": { transform: "translateY(-4px)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar src={user.image} alt={`${user.firstName} ${user.lastName}`} sx={{ width: 52, height: 52 }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", lineHeight: 1.2 }}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">@{user.username}</Typography>
            </Box>
          </Box>

          <Chip label={capitalize(user.gender)} color={genderColor(user.gender)} size="small" sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <EmailIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary" noWrap>{user.email}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <PhoneIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">{user.phone}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BusinessIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary" noWrap>{user.company?.name}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
}

export default memo(UserCard);
