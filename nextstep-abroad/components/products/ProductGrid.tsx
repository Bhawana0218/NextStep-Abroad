import {
  Grid,
} from "@mui/material";

import ProductCard from "./ProductCard";

import { Product } from "@/types/product.types";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({
  products,
}: ProductGridProps) {
  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid
          key={product.id}
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 3,
          }}
        >
          <ProductCard
            product={product}
          />
        </Grid>
      ))}
    </Grid>
  );
}