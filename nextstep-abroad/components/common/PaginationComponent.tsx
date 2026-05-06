import { Box, Pagination } from "@mui/material";

interface PaginationProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

export default function PaginationComponent({ count, page, onChange }: PaginationProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Pagination count={count} page={page} onChange={onChange} color="primary" />
    </Box>
  );
}
