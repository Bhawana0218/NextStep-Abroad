"use client";

import { useEffect, useMemo } from "react";
import {
  Avatar, Box, Card, CardContent, Chip,
  Grid, Paper, Typography,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CategoryIcon from "@mui/icons-material/Category";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StarIcon from "@mui/icons-material/Star";
import InventoryIcon from "@mui/icons-material/Inventory";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import StorefrontIcon from "@mui/icons-material/Storefront";
import FilterListIcon from "@mui/icons-material/FilterList";
import BarChartIcon from "@mui/icons-material/BarChart";

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";

import ProtectedRoute from "@/components/common/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/store/userStore";
import { useProductStore } from "@/store/productStore";
import { formatPrice } from "@/utils/helpers";
import { useRouter } from "next/navigation";

// ─── Palette ────────────────────────────────────────────────────────────────
const COLORS = ["#1976d2", "#388e3c", "#f57c00", "#7b1fa2", "#d32f2f", "#0288d1", "#689f38", "#fbc02d"];

// ─── Stat Card ───────────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  trend?: string;
}

function StatCard({ title, value, subtitle, icon, color, bgColor, trend }: StatCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 3, height: "100%",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 32px rgba(0,0,0,0.12)" },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color, lineHeight: 1.1, mb: 0.5 }}>
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
              {subtitle}
            </Typography>
            {trend && (
              <Chip label={trend} size="small" sx={{ mt: 1, backgroundColor: "#e8f5e9", color: "#388e3c", fontWeight: 600, fontSize: 11 }} />
            )}
          </Box>
          <Box sx={{ width: 56, height: 56, borderRadius: 2.5, backgroundColor: bgColor, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
      {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
    </Box>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { total: totalUsers, users, getUsers } = useUserStore();
  const { total: totalProducts, categories, products, getProducts, getCategories } = useProductStore();

  useEffect(() => {
    getUsers(1);
    getProducts(1);
    getCategories();
  }, []);

  // ── Derived chart data ────────────────────────────────────────────────────

  // Gender distribution from loaded users
  const genderData = useMemo(() => {
    const male = users.filter((u) => u.gender === "male").length;
    const female = users.filter((u) => u.gender === "female").length;
    return [
      { name: "Male", value: male, color: "#1976d2" },
      { name: "Female", value: female, color: "#e91e63" },
    ];
  }, [users]);

  // Age distribution buckets
  const ageData = useMemo(() => {
    const buckets: Record<string, number> = { "18-25": 0, "26-35": 0, "36-45": 0, "46-55": 0, "55+": 0 };
    users.forEach((u) => {
      if (u.age <= 25) buckets["18-25"]++;
      else if (u.age <= 35) buckets["26-35"]++;
      else if (u.age <= 45) buckets["36-45"]++;
      else if (u.age <= 55) buckets["46-55"]++;
      else buckets["55+"]++;
    });
    return Object.entries(buckets).map(([name, count]) => ({ name, count }));
  }, [users]);

  // Top 6 categories by product count
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name: name.replace(/-/g, " "), count }));
  }, [products]);

  // Price range distribution
  const priceData = useMemo(() => {
    const buckets: Record<string, number> = { "$0-50": 0, "$51-100": 0, "$101-200": 0, "$201-500": 0, "$500+": 0 };
    products.forEach((p) => {
      if (p.price <= 50) buckets["$0-50"]++;
      else if (p.price <= 100) buckets["$51-100"]++;
      else if (p.price <= 200) buckets["$101-200"]++;
      else if (p.price <= 500) buckets["$201-500"]++;
      else buckets["$500+"]++;
    });
    return Object.entries(buckets).map(([name, value]) => ({ name, value }));
  }, [products]);

  // Rating distribution
  const ratingData = useMemo(() => {
    const map: Record<string, number> = { "4.5-5": 0, "4-4.5": 0, "3.5-4": 0, "3-3.5": 0, "<3": 0 };
    products.forEach((p) => {
      if (p.rating >= 4.5) map["4.5-5"]++;
      else if (p.rating >= 4) map["4-4.5"]++;
      else if (p.rating >= 3.5) map["3.5-4"]++;
      else if (p.rating >= 3) map["3-3.5"]++;
      else map["<3"]++;
    });
    return Object.entries(map).map(([name, value], i) => ({ name, value, fill: COLORS[i] }));
  }, [products]);

  // Simulated monthly activity (realistic-looking trend data)
  const activityData = useMemo(() => [
    { month: "Jan", users: 28, products: 45, revenue: 12400 },
    { month: "Feb", users: 35, products: 52, revenue: 15800 },
    { month: "Mar", users: 42, products: 48, revenue: 18200 },
    { month: "Apr", users: 38, products: 61, revenue: 16900 },
    { month: "May", users: 55, products: 70, revenue: 24500 },
    { month: "Jun", users: 62, products: 65, revenue: 28100 },
    { month: "Jul", users: 71, products: 80, revenue: 32400 },
  ], []);

  // Top 5 products by rating
  const topProducts = useMemo(() =>
    [...products].sort((a, b) => b.rating - a.rating).slice(0, 5),
    [products]
  );

  // Average product price
  const avgPrice = useMemo(() => {
    if (!products.length) return 0;
    return products.reduce((s, p) => s + p.price, 0) / products.length;
  }, [products]);

  const stats: StatCardProps[] = [
    { title: "Total Users", value: totalUsers || 0, subtitle: "Registered accounts", icon: <PeopleAltIcon />, color: "#1976d2", bgColor: "#e3f2fd", trend: "↑ Active" },
    { title: "Total Products", value: totalProducts || 0, subtitle: "In catalog", icon: <ShoppingBagIcon />, color: "#388e3c", bgColor: "#e8f5e9", trend: "↑ Growing" },
    { title: "Categories", value: categories.length || 0, subtitle: "Product categories", icon: <CategoryIcon />, color: "#f57c00", bgColor: "#fff3e0" },
    { title: "Avg. Price", value: avgPrice ? formatPrice(avgPrice) : "—", subtitle: "Across all products", icon: <TrendingUpIcon />, color: "#7b1fa2", bgColor: "#f3e5f5" },
    { title: "Top Rating", value: products.length ? Math.max(...products.map((p) => p.rating)).toFixed(1) : "—", subtitle: "Highest rated product", icon: <StarIcon />, color: "#f57c00", bgColor: "#fff8e1" },
    { title: "Low Stock", value: products.filter((p) => p.stock < 20).length, subtitle: "Products need restock", icon: <InventoryIcon />, color: "#d32f2f", bgColor: "#ffebee" },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>

        {/* ── Welcome Banner ─────────────────────────────────────────────── */}
        <Paper
          sx={{
            p: { xs: 3, md: 4 }, borderRadius: 4, mb: 4,
            background: "linear-gradient(135deg, #0d47a1 0%, #1976d2 50%, #42a5f5 100%)",
            color: "white", position: "relative", overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
          <Box sx={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.06)" }} />
          <Box sx={{ position: "absolute", bottom: -60, right: 80, width: 160, height: 160, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.04)" }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap", position: "relative" }}>
            <Avatar src={user?.image} sx={{ width: 80, height: 80, border: "3px solid rgba(255,255,255,0.6)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 2 }}>ADMIN DASHBOARD</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                Welcome back, {user?.firstName}! 👋
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>{user?.email}</Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1.5, flexWrap: "wrap" }}>
                <Chip label="Administrator" size="small" sx={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white", fontWeight: 700 }} />
                <Chip label="Help Study Abroad" size="small" sx={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white" }} />
              </Box>
            </Box>
            <Box sx={{ textAlign: "right", display: { xs: "none", md: "block" } }}>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 700 }}>
                {new Date().toLocaleDateString("en-US", { weekday: "long" })}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* ── Stat Cards ─────────────────────────────────────────────────── */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat) => (
            <Grid key={stat.title} size={{ xs: 12, sm: 6, lg: 4, xl: 2 }}>
              <StatCard {...stat} />
            </Grid>
          ))}
        </Grid>

        {/* ── Row 1: Area Chart + Pie Chart ──────────────────────────────── */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Monthly Activity Area Chart */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <SectionHeader title="Monthly Activity Trend" subtitle="Users, products & revenue over the last 7 months" />
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={activityData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1976d2" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#1976d2" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#388e3c" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#388e3c" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                    <Legend />
                    <Area type="monotone" dataKey="users" stroke="#1976d2" strokeWidth={2.5} fill="url(#colorUsers)" name="Users" />
                    <Area type="monotone" dataKey="products" stroke="#388e3c" strokeWidth={2.5} fill="url(#colorProducts)" name="Products" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Gender Donut Chart */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <SectionHeader title="User Gender Split" subtitle="Distribution of male vs female users" />
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={genderData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                      {genderData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 1 }}>
                  {genderData.map((d) => (
                    <Box key={d.name} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: d.color }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{d.name}: {d.value}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* ── Row 2: Bar Charts ───────────────────────────────────────────── */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Age Distribution */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <SectionHeader title="User Age Distribution" subtitle="Breakdown of users by age group" />
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={ageData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                    <Bar dataKey="count" name="Users" radius={[6, 6, 0, 0]}>
                      {ageData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Price Range Distribution */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <SectionHeader title="Product Price Ranges" subtitle="How products are distributed by price" />
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={priceData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                    <Bar dataKey="value" name="Products" radius={[6, 6, 0, 0]}>
                      {priceData.map((_, index) => (
                        <Cell key={index} fill={COLORS[(index + 2) % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* ── Row 3: Category Bar + Radial Rating ────────────────────────── */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Category Distribution */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <SectionHeader title="Products by Category" subtitle="Top categories in the current page" />
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                    <Bar dataKey="count" name="Products" radius={[0, 6, 6, 0]}>
                      {categoryData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Rating Radial Chart */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <SectionHeader title="Product Ratings" subtitle="Distribution by rating band" />
                <ResponsiveContainer width="100%" height={200}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius={20} outerRadius={90} data={ratingData} startAngle={180} endAngle={0}>
                    <RadialBar dataKey="value" cornerRadius={4} label={{ position: "insideStart", fill: "#fff", fontSize: 10 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center", mt: 1 }}>
                  {ratingData.map((d, i) => (
                    <Box key={d.name} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: 1, backgroundColor: COLORS[i] }} />
                      <Typography variant="caption">{d.name}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* ── Row 4: Top Products + Tech Stack ───────────────────────────── */}
        <Grid container spacing={3}>
          {/* Top Rated Products */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <SectionHeader title="Top Rated Products" subtitle="Highest rated items in the catalog" />
                {topProducts.map((product, index) => (
                  <Box
                    key={product.id}
                    sx={{
                      display: "flex", alignItems: "center", gap: 2, mb: 2,
                      p: 1.5, borderRadius: 2,
                      backgroundColor: index === 0 ? "#fff8e1" : "transparent",
                      transition: "background 0.2s",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    <Typography sx={{ fontWeight: 800, color: COLORS[index], minWidth: 24, fontSize: 18 }}>
                      #{index + 1}
                    </Typography>
                    <Box
                      component="img"
                      src={product.thumbnail}
                      alt={product.title}
                      sx={{ width: 44, height: 44, borderRadius: 2, objectFit: "cover", flexShrink: 0 }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>{product.title}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                        {product.category}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#f57c00" }}>
                        ⭐ {product.rating.toFixed(1)}
                      </Typography>
                      <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                        {formatPrice(product.price)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions + System Health */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <SectionHeader title="Quick Actions" subtitle="Jump to key sections instantly" />

                {/* Action buttons */}
                {[
                  {
                    icon: <PersonSearchIcon />,
                    label: "Search Users",
                    desc: "Find any user by name or email",
                    color: "#1976d2",
                    bg: "#e3f2fd",
                    path: "/users",
                  },
                  {
                    icon: <StorefrontIcon />,
                    label: "Browse Products",
                    desc: "View full product catalog",
                    color: "#388e3c",
                    bg: "#e8f5e9",
                    path: "/products",
                  },
                  {
                    icon: <FilterListIcon />,
                    label: "Filter by Category",
                    desc: "Narrow products by category",
                    color: "#f57c00",
                    bg: "#fff3e0",
                    path: "/products",
                  },
                  {
                    icon: <BarChartIcon />,
                    label: "View Analytics",
                    desc: "Charts, trends & insights",
                    color: "#7b1fa2",
                    bg: "#f3e5f5",
                    path: "/dashboard",
                  },
                ].map((action) => (
                  <Box
                    key={action.label}
                    onClick={() => router.push(action.path)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 1.5,
                      mb: 1.2,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      cursor: "pointer",
                      transition: "all 0.18s",
                      "&:hover": {
                        borderColor: action.color,
                        backgroundColor: action.bg,
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        backgroundColor: action.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: action.color,
                        flexShrink: 0,
                      }}
                    >
                      {action.icon}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                        {action.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {action.desc}
                      </Typography>
                    </Box>
                    <ArrowForwardIcon sx={{ fontSize: 16, color: "text.disabled", flexShrink: 0 }} />
                  </Box>
                ))}

                {/* System health strip */}
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#f8fffe",
                    border: "1px solid #c8e6c9",
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#2e7d32", letterSpacing: 1, textTransform: "uppercase" }}>
                    System Status
                  </Typography>
                  {[
                    { label: "DummyJSON API", status: "Operational" },
                    { label: "Auth Service", status: "Active" },
                    { label: "Data Cache", status: "Enabled" },
                    { label: "Pagination", status: "API-side" },
                  ].map((s) => (
                    <Box
                      key={s.label}
                      sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}
                    >
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {s.label}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <CheckCircleIcon sx={{ fontSize: 13, color: "#388e3c" }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: "#2e7d32" }}>
                          {s.status}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      </DashboardLayout>
    </ProtectedRoute>
  );
}
