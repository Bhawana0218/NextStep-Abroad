"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Paper } from "@mui/material";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Loader from "@/components/common/Loader";
import UserDetails from "@/components/users/UserDetails";

import { useUserStore } from "@/store/userStore";

export default function UserDetailsPage() {
  const params = useParams();
  const { selectedUser, loading, getSingleUser } = useUserStore();

  useEffect(() => {
    getSingleUser(Number(params.id));
  }, [params.id]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 4 }}>
          {loading || !selectedUser ? (
            <Loader type="detail" />
          ) : (
            <UserDetails user={selectedUser} />
          )}
        </Paper>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
