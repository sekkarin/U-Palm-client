// components/SkeletonLoader.tsx

import React from "react";
import { Box, Skeleton, Grid } from "@mui/material";

const SkeletonLoader: React.FC = () => {
  return (
    <Box sx={{ width: "100%" }}>
      {/* Navbar Skeleton */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: 64,
          marginBottom: "20px",
          padding: "0 16px",
          mt: 1,
        }}
      >
        <Skeleton
          variant="circular"
          width={60}
          height={60}
          sx={{ marginRight: "auto" }}
        />

        <Box sx={{ display: "flex", marginLeft: "auto", gap: 2 }}>
          <Skeleton variant="circular" width={60} height={60} />
          <Skeleton variant="circular" width={60} height={60} />
          <Skeleton variant="circular" width={60} height={60} />
        </Box>
      </Box>

      {/* Content Skeleton */}
      <Box sx={{ padding: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" width="100%" height={40} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="90%" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Skeleton variant="rectangular" width="100%" height={200} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Skeleton variant="rectangular" width="100%" height={200} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" width="100%" height={300} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SkeletonLoader;
