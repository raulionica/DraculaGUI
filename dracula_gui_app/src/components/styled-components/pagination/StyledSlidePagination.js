import React from 'react';
import { Box, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const StyledSlidePagination = ({ totalPages, currentPage, onPageChange }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center', 
        gap: 2, 
        mt: 4,
        mb: 1
      }}
    >
      <IconButton 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        size="small"
        sx={{ color: 'text.secondary' }}
      >
        <ChevronLeft size={20} />
      </IconButton>

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {Array.from({ length: totalPages }).map((_, index) => (
          <Box
            key={index}
            onClick={() => onPageChange(index + 1)}
            sx={{
              width: 24,
              height: 3,
              backgroundColor: currentPage === index + 1 ? 'info.main' : 'action.disabled',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: currentPage === index + 1 ? 'info.main' : 'action.hover',
              }
            }}
          />
        ))}
      </Box>

      <IconButton 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        size="small"
        sx={{ color: 'text.secondary' }}
      >
        <ChevronRight size={20} />
      </IconButton>
    </Box>
  );
};

export default StyledSlidePagination;