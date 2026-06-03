import React from 'react';
import { Card, Box, Typography, Skeleton } from '@mui/material';

const StatCard = ({ title, value, icon: Icon, color = 'primary', loading = false }) => {
  const colorMap = {
    primary: '#0F4C81',
    secondary: '#1ABC9C',
    success: '#27AE60',
    error: '#E74C3C',
    warning: '#F39C12',
  };

  return (
    <Card sx={{ p: 2.5, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ color: '#7F8C8D', mb: 1 }}>
            {title}
          </Typography>
          {loading ? (
            <Skeleton width="80%" height={40} />
          ) : (
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C3E50' }}>
              {value}
            </Typography>
          )}
        </Box>
        {Icon && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 50,
              borderRadius: 2,
              backgroundColor: `${colorMap[color]}15`,
            }}
          >
            <Icon sx={{ color: colorMap[color], fontSize: '1.75rem' }} />
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default StatCard;
