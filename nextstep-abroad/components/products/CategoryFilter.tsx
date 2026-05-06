import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { capitalize } from "@/utils/helpers";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onChange: (value: string) => void;
}

/**
 * CategoryFilter — dropdown for filtering products by category.
 * Categories come from the DummyJSON /products/categories endpoint.
 */
export default function CategoryFilter({
  categories,
  selectedCategory,
  onChange,
}: CategoryFilterProps) {
  return (
    <FormControl fullWidth>
      <InputLabel>Category</InputLabel>

      <Select
        value={selectedCategory}
        label="Category"
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="">All Categories</MenuItem>

        {categories.map((category) => (
          <MenuItem key={String(category)} value={String(category)}>
            {capitalize(String(category).replace(/-/g, " "))}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
