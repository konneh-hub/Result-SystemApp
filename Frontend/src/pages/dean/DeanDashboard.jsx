import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import StatCard from '../../components/cards/StatCard';
import BookIcon from '@mui/icons-material/Book';
import PeopleIcon from '@mui/icons-material/People';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AssignmentIcon from '@mui/icons-material/Assignment';

const DeanDashboard = () => (
  <Box>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Dean Dashboard</Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Faculty Departments" value="8" icon={BookIcon} color="primary" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Faculty Students" value="1250" icon={PeopleIcon} color="secondary" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Pending Approvals" value="12" icon={VerifiedUserIcon} color="warning" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Approved" value="125" icon={AssignmentIcon} color="success" />
      </Grid>
    </Grid>
  </Box>
);

export default DeanDashboard;
