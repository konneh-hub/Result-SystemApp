import React from 'react';
import { Card, Box, Typography, Avatar } from '@mui/material';

const UserCard = ({ name, email, role, avatar, sx = {} }) => {
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase() || 'U';
  };

  const roleColors = {
    admin: '#0F4C81',
    lecturer: '#1ABC9C',
    hod: '#F39C12',
    dean: '#E74C3C',
    exam_officer: '#3498DB',
    student: '#27AE60',
  };

  return (
    <Card sx={{ p: 2, textAlign: 'center', ...sx }}>
      <Avatar
        src={avatar}
        sx={{
          width: 80,
          height: 80,
          margin: '0 auto',
          mb: 1.5,
          bgcolor: roleColors[role] || '#0F4C81',
          fontSize: '2rem',
        }}
      >
        {getInitials(name)}
      </Avatar>
      <Typography variant="body1" sx={{ fontWeight: 600, color: '#2C3E50' }}>
        {name}
      </Typography>
      <Typography variant="caption" sx={{ color: '#7F8C8D', display: 'block' }}>
        {email}
      </Typography>
      <Box
        sx={{
          display: 'inline-block',
          mt: 1,
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          backgroundColor: `${roleColors[role] || '#0F4C81'}15`,
        }}
      >
        <Typography variant="caption" sx={{ color: roleColors[role] || '#0F4C81', fontWeight: 600 }}>
          {role}
        </Typography>
      </Box>
    </Card>
  );
};

export default UserCard;
