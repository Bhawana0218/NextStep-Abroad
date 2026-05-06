/**
 * ─────────────────────────────────────────────────────────────────────────────
 * useProductStore — Zustand store for products, categories, and single product.
 *
 * WHY ZUSTAND (vs Redux / Context):
 *   - All async API calls (getProducts, searchAllProducts, filterByCategory,
 *     getSingleProduct, getCategories) are plain async functions inside the
 *     store — no action creators, no reducers, no dispatch calls needed.
 *   - Zustand's `set` function merges state shallowly, so partial updates
 *     like `set({ loading: true })` don't wipe out the rest of the state.
 *   - Components subscribe to only what they need:
 *       const products = useProductStore((s) => s.products);
 *     This component will NOT re-render when `selectedProduct` changes.
 *   - No Provider required — the store is a module-level singleton.
 *
 * CACHING STRATEGY:
 *   Product pages are cached in `cachedProducts` by page number.
 *
 *   Why caching is useful:
 *     The products API returns 194 total products. Without caching, every
 *     pagination click fires a new network request even for pages already
 *     visited. With the cache, page 1 loads once and is served from memory
 *     on every subsequent visit — making navigation instant.
 *
 *   Cache strategy: write-through, page-keyed, in-memory (session lifetime).
 *   Cache invalidation:
 *     - Search results bypass the cache (queries are dynamic).
 *     - Category filter results bypass the cache (category can change).
 *     - Only plain paginated results are cached.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { create } from "zustand";
import {
  fetchProducts,
  fetchSingleProduct,
  searchProducts,
  fetchProductsByCategory,
  fetchCategories,
} from "@/services/productService";
import { Product, ProductsResponse } from "@/types/product.types";

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;

  categories: string[];

  total: number;
  page: number;
  limit: number;

  loading: boolean;
  error: string | null;

  /** In-memory page cache: { [pageNumber]: Product[] } */
  cachedProducts: Record<number, Product[]>;

  getProducts: (page?: number) => Promise<void>;
  searchAllProducts: (query: string) => Promise<void>;
  filterByCategory: (category: string) => Promise<void>;
  getSingleProduct: (id: number) => Promise<void>;
  getCategories: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  selectedProduct: null,

  categories: [],

  total: 0,
  page: 1,
  limit: 10,

  loading: false,
  error: null,

  cachedProducts: {},

  /**
   * getProducts — fetches a paginated list of products.
   *
   * Checks the in-memory cache first. If the requested page is already
   * cached, state is updated immediately without a network request.
   */
  getProducts: async (page = 1) => {
    const { limit, cachedProducts } = get();

    // ── Cache check ──────────────────────────────────────────────────────────
    if (cachedProducts[page]) {
      set({ products: cachedProducts[page], page });
      return; // Skip API call — data already in memory
    }

    try {
      set({ loading: true, error: null });

      const skip = (page - 1) * limit;
      const response: ProductsResponse = await fetchProducts(limit, skip);

      set((state) => ({
        products: response.products,
        total: response.total,
        page,
        // Write result into cache for future page visits
        cachedProducts: { ...state.cachedProducts, [page]: response.products },
        loading: false,
      }));
    } catch {
      set({ error: "Failed to fetch products", loading: false });
    }
  },

  /**
   * searchAllProducts — searches products by title/description.
   *
   * Bypasses the cache — search results are dynamic and should always
   * reflect the latest query. The search input uses a 500ms debounce
   * to avoid firing on every keystroke.
   */
  searchAllProducts: async (query) => {
    try {
      set({ loading: true, error: null });
      const response = await searchProducts(query);
      set({ products: response.products, total: response.total, loading: false });
    } catch {
      set({ error: "Search failed", loading: false });
    }
  },

  /**
   * filterByCategory — fetches all products in a given category.
   *
   * Bypasses the cache — category results are not paginated by the API
   * and the selected category can change at any time.
   */
  filterByCategory: async (category) => {
    try {
      set({ loading: true, error: null });
      const response = await fetchProductsByCategory(category);
      set({ products: response.products, total: response.total, loading: false });
    } catch {
      set({ error: "Category filter failed", loading: false });
    }
  },

  /**
   * getSingleProduct — fetches full details for one product by ID.
   * Used on the /products/[id] detail page.
   */
  getSingleProduct: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await fetchSingleProduct(id);
      set({ selectedProduct: response, loading: false });
    } catch {
      set({ error: "Failed to fetch product", loading: false });
    }
  },

  /**
   * getCategories — fetches the list of all product category names.
   * Called once on mount of the Products page to populate the filter dropdown.
   */
  getCategories: async () => {
    try {
      const response = await fetchCategories();
      set({ categories: response });
    } catch (error) {
      // Non-critical — the filter dropdown simply won't populate
      console.warn("Failed to fetch categories:", error);
    }
  },
}));
