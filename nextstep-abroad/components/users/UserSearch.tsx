"use client";

import { memo } from "react";
import { Box, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface UserSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * UserSearch — dedicated search input for the users list.
 * Includes a clear button to reset the search query.
 * Memoized to avoid re-renders when parent state changes
 * but the search value hasn't.
 */
function UserSearch({ value, onChange, placeholder }: UserSearchProps) {
  return (
    <Box>
      <TextField
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search users by name, email, or username..."}
        variant="outlined"

        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),

            endAdornment: value ? (
              <InputAdornment position="end">
                <Tooltip title="Clear search">
                  <IconButton
                    size="small"
                    onClick={() => onChange("")}
                    aria-label="clear search"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ) : null,
          },
        }}
      />
    </Box>
  );
}

export default memo(UserSearch);
