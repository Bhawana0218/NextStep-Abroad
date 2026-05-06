import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { memo } from "react";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

/**
 * SearchBar — memoized reusable search input with a leading icon.
 */
function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <TextField
      fullWidth
      value={value}
      onChange={onChange}
      placeholder={placeholder || "Search..."}
      variant="outlined"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

export default memo(SearchBar);
