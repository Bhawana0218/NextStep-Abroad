import { Box, Grid, Skeleton } from "@mui/material";

interface LoaderProps {
  type?: "table" | "card" | "detail";
}

/**
 * Loader — skeleton placeholder shown while async data is loading.
 * Three variants:
 *  - "table"  → rows of rectangular skeletons (users list)
 *  - "card"   → grid of card skeletons (products list)
 *  - "detail" → single large skeleton (detail pages)
 */
export default function Loader({ type = "table" }: LoaderProps) {
  if (type === "card") {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 6, 8].map((item) => (
          <Grid key={item} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Skeleton
              variant="rectangular"
              height={320}
              sx={{ borderRadius: 3 }}
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (type === "detail") {
    return (
      <Box>
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3, mb: 3 }} />
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid key={item} size={{ xs: 12, sm: 6 }}>
              <Skeleton
                variant="rectangular"
                height={140}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // Default: table skeleton
  return (
    <Box>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Skeleton
          key={item}
          variant="rectangular"
          height={60}
          sx={{ mb: 1.5, borderRadius: 2 }}
        />
      ))}
    </Box>
  );
}
