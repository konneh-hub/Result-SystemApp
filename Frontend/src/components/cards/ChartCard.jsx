import React from 'react';
import { Card, Box, Typography, CircularProgress } from '@mui/material';

const ChartCard = ({ title, subtitle, children, loading = false, sx = {} }) => {
  return (
    <Card sx={{ p: 3, height: '100%', ...sx }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C3E50' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ color: '#7F8C8D' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        children
      )}
    </Card>
  );
};

export default ChartCard;
