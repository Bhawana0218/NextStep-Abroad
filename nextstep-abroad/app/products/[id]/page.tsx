"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Paper } from "@mui/material";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Loader from "@/components/common/Loader";
import ProductDetails from "@/components/products/ProductDetails";

import { useProductStore } from "@/store/productStore";

export default function ProductDetailsPage() {
  const params = useParams();
  const { selectedProduct, loading, getSingleProduct } = useProductStore();

  useEffect(() => {
    getSingleProduct(Number(params.id));
  }, [params.id]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 4 }}>
          {loading || !selectedProduct ? (
            <Loader type="detail" />
          ) : (
            <ProductDetails product={selectedProduct} />
          )}
        </Paper>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
