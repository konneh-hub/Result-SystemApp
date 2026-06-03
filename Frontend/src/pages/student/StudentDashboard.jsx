import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import StatCard from '../../components/cards/StatCard';
import BookIcon from '@mui/icons-material/Book';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';

const StudentDashboard = () => (
  <Box>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Student Dashboard</Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Registered Courses" value="5" icon={BookIcon} color="primary" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="GPA" value="3.85" icon={SchoolIcon} color="secondary" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="CGPA" value="3.82" icon={SchoolIcon} color="success" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard title="Pending Results" value="2" icon={AssignmentIcon} color="warning" />
      </Grid>
    </Grid>
  </Box>
);

export default StudentDashboard;
