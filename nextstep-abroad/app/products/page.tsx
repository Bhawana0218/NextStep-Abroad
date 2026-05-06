"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert, Box, Card, CardContent, Chip,
  Grid, Paper, Typography,
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import StarIcon from "@mui/icons-material/Star";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import InventoryIcon from "@mui/icons-material/Inventory";

import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis,
} from "recharts";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import SearchBar from "@/components/common/SearchBar";
import PaginationComponent from "@/components/common/PaginationComponent";
import Loader from "@/components/common/Loader";
import ProductGrid from "@/components/products/ProductGrid";
import CategoryFilter from "@/components/products/CategoryFilter";

import useDebounce from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { useProductStore } from "@/store/productStore";
import { formatPrice } from "@/utils/helpers";

const COLORS = ["#1976d2", "#388e3c", "#f57c00", "#7b1fa2", "#d32f2f", "#0288d1", "#689f38", "#fbc02d"];

export default function ProductsPage() {
  const { products, categories, total, page, limit, loading, error, getProducts, searchAllProducts, filterByCategory, getCategories } = useProductStore();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => { getCategories(); getProducts(1); }, []);

  useEffect(() => {
    if (debouncedSearch.trim()) searchAllProducts(debouncedSearch);
    else if (selectedCategory) filterByCategory(selectedCategory);
    else getProducts(page);
  }, [debouncedSearch, selectedCategory]);

  const handlePageChange = useCallback((newPage: number) => { getProducts(newPage); }, [getProducts]);
  const { totalPages, handleChange } = usePagination({ total, limit, page, onPageChange: handlePageChange });
  const isFiltered = !!search || !!selectedCategory;

  // ── Chart data ────────────────────────────────────────────────────────────
  const categoryPieData = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => { map[p.category] = (map[p.category] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => ({ name: name.replace(/-/g, " "), value }));
  }, [products]);

  const ratingBarData = useMemo(() => {
    const b: Record<string, number> = { "4.5-5★": 0, "4-4.5★": 0, "3.5-4★": 0, "3-3.5★": 0, "<3★": 0 };
    products.forEach((p) => {
      if (p.rating >= 4.5) b["4.5-5★"]++;
      else if (p.rating >= 4) b["4-4.5★"]++;
      else if (p.rating >= 3.5) b["3.5-4★"]++;
      else if (p.rating >= 3) b["3-3.5★"]++;
      else b["<3★"]++;
    });
    return Object.entries(b).map(([name, count]) => ({ name, count }));
  }, [products]);

  const scatterData = useMemo(() =>
    products.map((p) => ({ x: p.price, y: p.rating, z: p.stock, name: p.title })),
    [products]
  );

  const avgPrice = useMemo(() => products.length ? products.reduce((s, p) => s + p.price, 0) / products.length : 0, [products]);
  const avgRating = useMemo(() => products.length ? products.reduce((s, p) => s + p.rating, 0) / products.length : 0, [products]);
  const lowStock = useMemo(() => products.filter((p) => p.stock < 20).length, [products]);
  const highDiscount = useMemo(() => products.filter((p) => p.discountPercentage > 15).length, [products]);

  return (
    <ProtectedRoute>
      <DashboardLayout>

        {/* ── Page Header ──────────────────────────────────────────────── */}
        <Paper
          sx={{
            p: 3, borderRadius: 4, mb: 3,
            background: "linear-gradient(135deg, #1b5e20 0%, #388e3c 50%, #66bb6a 100%)",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShoppingBagIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Products Management</Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                {total > 0 ? `${total} total products across ${categories.length} categories` : "Loading..."}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* ── Quick Stats ───────────────────────────────────────────────── */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: "Total Products", value: total, color: "#388e3c", bg: "#e8f5e9", icon: <ShoppingBagIcon /> },
            { label: "Avg. Price", value: avgPrice ? formatPrice(avgPrice) : "—", color: "#1976d2", bg: "#e3f2fd", icon: <LocalOfferIcon /> },
            { label: "Avg. Rating", value: avgRating ? `⭐ ${avgRating.toFixed(1)}` : "—", color: "#f57c00", bg: "#fff3e0", icon: <StarIcon /> },
            { label: "Low Stock", value: lowStock, color: "#d32f2f", bg: "#ffebee", icon: <InventoryIcon /> },
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
          {/* Category Pie */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Category Share</Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={categoryPieData} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value">
                      {categoryPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, justifyContent: "center", mt: 1 }}>
                  {categoryPieData.map((d, i) => (
                    <Chip key={d.name} label={`${d.name} (${d.value})`} size="small"
                      sx={{ backgroundColor: COLORS[i % COLORS.length] + "22", color: COLORS[i % COLORS.length], fontWeight: 600, fontSize: 10 }} />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Rating Distribution */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Rating Distribution</Typography>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={ratingBarData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                    <Bar dataKey="count" name="Products" radius={[5, 5, 0, 0]}>
                      {ratingBarData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Price vs Rating Scatter */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>Price vs Rating</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
                  Bubble size = stock level
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <ScatterChart margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="x" name="Price" tick={{ fontSize: 10 }} label={{ value: "Price ($)", position: "insideBottom", offset: -2, fontSize: 10 }} />
                    <YAxis dataKey="y" name="Rating" domain={[0, 5]} tick={{ fontSize: 10 }} />
                    <ZAxis dataKey="z" range={[30, 200]} />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                      formatter={(value, name) => [name === "Price" ? formatPrice(Number(value)) : value, name]}
                    />
                    <Scatter data={scatterData} fill="#1976d2" fillOpacity={0.7} />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* ── Products Grid ─────────────────────────────────────────────── */}
        <Paper sx={{ borderRadius: 4, overflow: "hidden" }}>
          <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "divider" }}>
            <Grid container spacing={2} sx={{ alignItems: "center" }}>
              <Grid size={{ xs: 12, md: 8 }}>
                <SearchBar
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setSelectedCategory(""); }}
                  placeholder="Search products by name..."
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onChange={(val) => { setSelectedCategory(val); setSearch(""); }}
                />
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ p: 3 }}>
            {loading && <Loader type="card" />}
            {!loading && error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

            {!loading && !error && products.length > 0 && (
              <>
                <ProductGrid products={products} />
                {!isFiltered && <PaginationComponent count={totalPages} page={page} onChange={handleChange} />}
              </>
            )}

            {!loading && !error && products.length === 0 && (
              <Alert severity="info" sx={{ borderRadius: 2 }}>No products found. Try a different search or category.</Alert>
            )}
          </Box>
        </Paper>

      </DashboardLayout>
    </ProtectedRoute>
  );
}
