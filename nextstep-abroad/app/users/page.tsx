"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert, Box, Card, CardContent, Chip,
  Grid, Paper, Tab, Tabs, Typography,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WcIcon from "@mui/icons-material/Wc";
import BusinessIcon from "@mui/icons-material/Business";

import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import SearchBar from "@/components/common/SearchBar";
import PaginationComponent from "@/components/common/PaginationComponent";
import Loader from "@/components/common/Loader";
import UserTable from "@/components/users/UserTable";
import UserCard from "@/components/users/UserCard";

import useDebounce from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { useUserStore } from "@/store/userStore";

const COLORS = ["#1976d2", "#e91e63", "#388e3c", "#f57c00", "#7b1fa2", "#0288d1"];

export default function UsersPage() {
  const { users, total, page, limit, loading, error, getUsers, searchAllUsers } = useUserStore();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      searchAllUsers(debouncedSearch);
    } else {
      getUsers(page);
    }
  }, [debouncedSearch]);

  // Initial load
  useEffect(() => {
    getUsers(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => { getUsers(newPage); }, [getUsers]);
  const { totalPages, handleChange } = usePagination({ total, limit, page, onPageChange: handlePageChange });

  // ── Chart data ────────────────────────────────────────────────────────────
  const genderData = useMemo(() => {
    const male = users.filter((u) => u.gender === "male").length;
    const female = users.filter((u) => u.gender === "female").length;
    return [{ name: "Male", value: male }, { name: "Female", value: female }];
  }, [users]);

  const ageData = useMemo(() => {
    const b: Record<string, number> = { "18-25": 0, "26-35": 0, "36-45": 0, "46-55": 0, "55+": 0 };
    users.forEach((u) => {
      if (u.age <= 25) b["18-25"]++;
      else if (u.age <= 35) b["26-35"]++;
      else if (u.age <= 45) b["36-45"]++;
      else if (u.age <= 55) b["46-55"]++;
      else b["55+"]++;
    });
    return Object.entries(b).map(([name, count]) => ({ name, count }));
  }, [users]);

  const companyData = useMemo(() => {
    const map: Record<string, number> = {};
    users.forEach((u) => {
      if (u.company?.department) {
        map[u.company.department] = (map[u.company.department] || 0) + 1;
      }
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }));
  }, [users]);

  const maleCount = users.filter((u) => u.gender === "male").length;
  const femaleCount = users.filter((u) => u.gender === "female").length;
  const avgAge = users.length ? Math.round(users.reduce((s, u) => s + u.age, 0) / users.length) : 0;

  return (
    <ProtectedRoute>
      <DashboardLayout>

        {/* ── Page Header ──────────────────────────────────────────────── */}
        <Paper
          sx={{
            p: 3, borderRadius: 4, mb: 3,
            background: "linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PeopleAltIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Users Management</Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                {total > 0 ? `${total} total registered users` : "Loading..."}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* ── Quick Stats ───────────────────────────────────────────────── */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: "Total Users", value: total, color: "#1976d2", bg: "#e3f2fd", icon: <PeopleAltIcon /> },
            { label: "Male Users", value: maleCount, color: "#1976d2", bg: "#e3f2fd", icon: <WcIcon /> },
            { label: "Female Users", value: femaleCount, color: "#e91e63", bg: "#fce4ec", icon: <WcIcon /> },
            { label: "Avg. Age", value: avgAge || "—", color: "#f57c00", bg: "#fff3e0", icon: <BusinessIcon /> },
          ].map((s) => (
            <Grid key={s.label} size={{ xs: 6, md: 3 }}>
              <Card sx={{ borderRadius: 3, "&:hover": { transform: "translateY(-2px)", boxShadow: 4 }, transition: "0.2s" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>{s.label}</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: s.color }}>{s.value}</Typography>
                    </Box>
                    <Box sx={{ width: 40, height: 40, borderRadius: 2, backgroundColor: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>
                      {s.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* ── Charts Row ────────────────────────────────────────────────── */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Gender Donut */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Gender Distribution</Typography>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={genderData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                      <Cell fill="#1976d2" />
                      <Cell fill="#e91e63" />
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
                  {[{ label: "Male", color: "#1976d2", val: maleCount }, { label: "Female", color: "#e91e63", val: femaleCount }].map((d) => (
                    <Box key={d.label} sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: d.color }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{d.label}: {d.val}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Age Bar Chart */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Age Groups</Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={ageData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                    <Bar dataKey="count" name="Users" radius={[5, 5, 0, 0]}>
                      {ageData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Department Bar Chart */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Top Departments</Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={companyData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={70} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                    <Bar dataKey="count" name="Users" radius={[0, 5, 5, 0]}>
                      {companyData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* ── Table / Card View ─────────────────────────────────────────── */}
        <Paper sx={{ borderRadius: 4, overflow: "hidden" }}>
          <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: 240 }}>
              <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, username..." />
            </Box>
            <Tabs value={viewMode} onChange={(_, v) => setViewMode(v)} sx={{ "& .MuiTab-root": { minWidth: 80, fontWeight: 600 } }}>
              <Tab label="Table" value="table" />
              <Tab label="Cards" value="card" />
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            {loading && <Loader type="table" />}
            {!loading && error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

            {!loading && !error && users.length > 0 && (
              <>
                {viewMode === "table" ? (
                  <UserTable users={users} />
                ) : (
                  <Grid container spacing={2}>
                    {users.map((user) => (
                      <Grid key={user.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                        <UserCard user={user} />
                      </Grid>
                    ))}
                  </Grid>
                )}
                {!search && (
                  <PaginationComponent count={totalPages} page={page} onChange={handleChange} />
                )}
              </>
            )}

            {!loading && !error && users.length === 0 && (
              <Alert severity="info" sx={{ borderRadius: 2 }}>No users found. Try a different search term.</Alert>
            )}
          </Box>
        </Paper>

      </DashboardLayout>
    </ProtectedRoute>
  );
}
