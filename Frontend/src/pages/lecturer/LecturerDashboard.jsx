import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import StatCard from '../../components/cards/StatCard';
import BookIcon from '@mui/icons-material/Book';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';

const LecturerDashboard = () => (
  <Box>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Lecturer Dashboard</Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="My Courses" value="5" icon={BookIcon} color="primary" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Students" value="120" icon={PeopleIcon} color="secondary" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Pending Results" value="3" icon={AssignmentIcon} color="warning" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Submitted" value="12" icon={AssignmentIcon} color="success" />
      </Grid>
    </Grid>
  </Box>
);

export default LecturerDashboard;
