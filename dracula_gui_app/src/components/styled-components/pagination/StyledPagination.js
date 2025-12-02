import React from "react";
import { Box, Pagination, PaginationItem, useMediaQuery, useTheme } from "@mui/material";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const StyledPagination = ({
  totalPages,
  currentPage = 1,
  handlePageChange,
  color = "info",
  shape = "rounded",
  size = "small",
  boundaryCount = 1,
  noSibling = false
}) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));

  // Dynamic sibling count based on screen size
  const getSiblingCount = () => {
    if (isXs) return 0;
    if (isSm) return 1;
    if (isMd) return 2;
    return 3;
  };

  return totalPages > 1 ? (
    <Box
      sx={{
        my: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Pagination
        variant="outlined"
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        renderItem={(item) => (
          <PaginationItem
            slots={{ previous: ChevronLeft, next: ChevronRight }}
            {...item}
          />
        )}
        boundaryCount={boundaryCount}
        siblingCount={
          noSibling ? 0 : getSiblingCount()
        }
        color={color}
        shape={shape}
        size={size}
      />
    </Box>
  ) : null;
};

export default StyledPagination;
