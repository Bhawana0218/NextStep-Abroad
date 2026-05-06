"use client";

import Link from "next/link";
import { memo } from "react";
import {
  Box, Button, Card, CardContent, Chip, Divider,
  Grid, LinearProgress, Rating, Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import InventoryIcon from "@mui/icons-material/Inventory";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import ProductCarousel from "./ProductCarousel";
import { Product } from "@/types/product.types";
import { formatPrice, discountedPrice, capitalize } from "@/utils/helpers";

interface ProductDetailsProps {
  product: Product;
}

function ProductDetails({ product }: ProductDetailsProps) {
  const finalPrice = discountedPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage > 0;

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Link href="/products" style={{ textDecoration: "none" }}>
          <Button startIcon={<ArrowBackIcon />} variant="outlined" size="small">
            Back to Products
          </Button>
        </Link>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ProductCarousel images={product.images} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Chip
            label={capitalize(product.category.replace(/-/g, " "))}
            color="primary"
            sx={{ mb: 2 }}
          />

          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            {product.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <Typography
              variant="h4"
              sx={{
                color: "primary.main",
                fontWeight: "bold",
              }}
            >
              {formatPrice(finalPrice)}
            </Typography>
            {hasDiscount && (
              <>
                <Typography variant="h6" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                  {formatPrice(product.price)}
                </Typography>
                <Chip label={`-${product.discountPercentage}%`} color="error" size="small" icon={<LocalOfferIcon />} />
              </>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <Rating value={product.rating} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary">
              ({product.rating.toFixed(1)})
            </Typography>
          </Box>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              mb: 3,
              lineHeight: 1.8,
            }}
          >
            {product.description}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <BrandingWatermarkIcon fontSize="small" color="primary" />
                    <Typography variant="caption" color="text.secondary">Brand</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 600 }}>{product.brand || "N/A"}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <InventoryIcon fontSize="small" color="primary" />
                    <Typography variant="caption" color="text.secondary">Stock</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 600 }}>{product.stock} units</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">Stock availability</Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary" }}
              >{product.stock} / 100</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(product.stock, 100)}
              color={product.stock > 50 ? "success" : product.stock > 20 ? "warning" : "error"}
              sx={{ borderRadius: 2, height: 8 }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default memo(ProductDetails);
