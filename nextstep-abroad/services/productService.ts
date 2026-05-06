import api from "./api";
import {
  Product,
  ProductsResponse,
} from "@/types/product.types";

type CategoryApiItem =
  | string
  | {
      slug?: string;
      name?: string;
      url?: string;
    };

export const fetchProducts = async (
  limit = 10,
  skip = 0
): Promise<ProductsResponse> => {
  const response = await api.get(
    `/products?limit=${limit}&skip=${skip}`
  );

  return response.data;
};

export const searchProducts = async (
  query: string
): Promise<ProductsResponse> => {
  const response = await api.get(
    `/products/search?q=${query}`
  );

  return response.data;
};

export const fetchProductsByCategory = async (
  category: string
): Promise<ProductsResponse> => {
  const response = await api.get(
    `/products/category/${encodeURIComponent(category)}`
  );

  return response.data;
};

export const fetchSingleProduct = async (
  id: number
): Promise<Product> => {
  const response = await api.get(`/products/${id}`);

  return response.data;
};

export const fetchCategories = async (): Promise<string[]> => {
  const response = await api.get(
    "/products/categories"
  );

  const rawCategories = response.data as CategoryApiItem[];

  if (!Array.isArray(rawCategories)) {
    return [];
  }

  return rawCategories
    .map((category) => {
      if (typeof category === "string") {
        return category;
      }

      return category.slug ?? category.name ?? "";
    })
    .filter((category): category is string => Boolean(category));
};
