import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import StatCard from '../../components/cards/StatCard';
import BookIcon from '@mui/icons-material/Book';
import PeopleIcon from '@mui/icons-material/People';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AssignmentIcon from '@mui/icons-material/Assignment';

const HODDashboard = () => (
  <Box>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>HOD Dashboard</Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Department Students" value="450" icon={PeopleIcon} color="primary" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Lecturers" value="25" icon={PeopleIcon} color="secondary" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Pending Approvals" value="8" icon={VerifiedUserIcon} color="warning" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Approved" value="42" icon={AssignmentIcon} color="success" />
      </Grid>
    </Grid>
  </Box>
);

export default HODDashboard;
