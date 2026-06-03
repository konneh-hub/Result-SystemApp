import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import StatCard from '../../components/cards/StatCard';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import BookIcon from '@mui/icons-material/Book';

const ExamOfficerDashboard = () => (
  <Box>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Exam Officer Dashboard</Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Results to Verify" value="45" icon={VerifiedUserIcon} color="warning" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Verified Results" value="320" icon={AssignmentIcon} color="success" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Pending GPAs" value="12" icon={BookIcon} color="primary" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Published" value="8" icon={PeopleIcon} color="secondary" />
      </Grid>
    </Grid>
  </Box>
);

export default ExamOfficerDashboard;
