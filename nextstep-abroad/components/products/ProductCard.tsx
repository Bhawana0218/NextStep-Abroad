"use client";

import Link from "next/link";
import { memo } from "react";
import { Box, Card, CardContent, CardMedia, Chip, Rating, Typography } from "@mui/material";
import { Product } from "@/types/product.types";
import { formatPrice, truncate } from "@/utils/helpers";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <Card
        sx={{
          height: "100%",
          borderRadius: 3,
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
          },
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={product.thumbnail}
          alt={product.title}
          sx={{ objectFit: "cover" }}
        />

        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Chip
              label={product.category}
              color="primary"
              size="small"
              sx={{ textTransform: "capitalize", maxWidth: 120 }}
            />
            <Typography
              sx={{
                fontWeight: "bold",
                color: "primary.main",
              }}
            >
              {formatPrice(product.price)}
            </Typography>
          </Box>

          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              minHeight: 48,
              lineHeight: 1.3,
            }}
          >
            {product.title}
          </Typography>

          <Rating value={product.rating} precision={0.5} readOnly size="small" />

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mt: 1,
            }}
          >
            {truncate(product.description, 80)}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}

export default memo(ProductCard);
