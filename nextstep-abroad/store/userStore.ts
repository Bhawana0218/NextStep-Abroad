/**
 * ─────────────────────────────────────────────────────────────────────────────
 * useUserStore — Zustand store for user list and single user state.
 *
 * WHY ZUSTAND (vs Redux / Context):
 *   - Async actions (getUsers, searchAllUsers, getSingleUser) are plain async
 *     functions — no thunks, no sagas, no extra middleware needed.
 *   - Components subscribe to only the slices they need, preventing unnecessary
 *     re-renders (e.g. a component reading `users` won't re-render when
 *     `selectedUser` changes).
 *   - The store is a module-level singleton — no Provider wrapping required.
 *
 * CACHING STRATEGY:
 *   Results are cached by page number in `cachedUsers`.
 *   Before every API call we check the cache first:
 *     - Cache HIT  → set state from cache, skip the network request entirely.
 *     - Cache MISS → fetch from API, store result in cache for future use.
 *
 *   Why caching is useful:
 *     Without it, navigating back to page 1 after visiting page 3 would fire
 *     a redundant API call for data we already have. Caching eliminates that,
 *     making navigation feel instant and reducing server load.
 *
 *   Cache strategy: write-through, page-keyed, in-memory (session lifetime).
 *   Cache invalidation: search results bypass the cache to avoid stale data.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { create } from "zustand";
import { fetchUsers, searchUsers, fetchSingleUser } from "@/services/userService";
import { User, UsersResponse } from "@/types/user.types";

interface UserState {
  users: User[];
  selectedUser: User | null;

  total: number;
  page: number;
  limit: number;

  loading: boolean;
  error: string | null;

  /** In-memory page cache: { [pageNumber]: User[] } */
  cachedUsers: Record<number, User[]>;

  getUsers: (page?: number) => Promise<void>;
  searchAllUsers: (query: string) => Promise<void>;
  getSingleUser: (id: number) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  selectedUser: null,

  total: 0,
  page: 1,
  limit: 10,

  loading: false,
  error: null,

  cachedUsers: {},

  /**
   * getUsers — fetches a paginated list of users.
   *
   * Checks the in-memory cache first. If the requested page is already
   * cached, it updates state immediately without making an API call.
   * This makes page navigation feel instant after the first load.
   */
  getUsers: async (page = 1) => {
    const { limit, cachedUsers } = get();

    // ── Cache check ──────────────────────────────────────────────────────────
    if (cachedUsers[page]) {
      set({ users: cachedUsers[page], page });
      return; // Skip API call — data already in memory
    }

    try {
      set({ loading: true, error: null });

      // DummyJSON uses `skip` for offset-based pagination
      const skip = (page - 1) * limit;
      const response: UsersResponse = await fetchUsers(limit, skip);

      set((state) => ({
        users: response.users,
        total: response.total,
        page,
        // Write result into cache for future page visits
        cachedUsers: { ...state.cachedUsers, [page]: response.users },
        loading: false,
      }));
    } catch {
      set({ error: "Failed to fetch users", loading: false });
    }
  },

  /**
   * searchAllUsers — searches users by name/email/username.
   *
   * Search results are NOT cached because the query can change on every
   * keystroke and caching partial results would cause stale data issues.
   * The search input uses a 500ms debounce to limit API calls.
   */
  searchAllUsers: async (query) => {
    try {
      set({ loading: true, error: null });
      const response = await searchUsers(query);
      set({ users: response.users, total: response.total, loading: false });
    } catch {
      set({ error: "Search failed", loading: false });
    }
  },

  /**
   * getSingleUser — fetches full details for one user by ID.
   * Used on the /users/[id] detail page.
   */
  getSingleUser: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await fetchSingleUser(id);
      set({ selectedUser: response, loading: false });
    } catch {
      set({ error: "Failed to fetch user", loading: false });
    }
  },
}));
