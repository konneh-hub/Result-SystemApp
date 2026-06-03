import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import { adminApi } from '../../api/adminApi';
import StatCard from '../../components/cards/StatCard';
import ChartCard from '../../components/cards/ChartCard';
import { BarChartComponent, LineChartComponent, PieChartComponent } from '../../components/charts/ChartComponents';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import AssignmentIcon from '@mui/icons-material/Assignment';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentDistribution, setStudentDistribution] = useState([]);
  const [departmentStats, setDepartmentStats] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getDashboardStats();
      const data = response.data;

      setStats({
        totalStudents: data.totalStudents || 0,
        totalStaff: data.totalStaff || 0,
        totalCourses: data.totalCourses || 0,
        totalFaculties: data.totalFaculties || 0,
        totalDepartments: data.totalDepartments || 0,
      });

      // Prepare chart data
      setStudentDistribution(
        data.studentsByLevel || [
          { name: '100L', value: 150 },
          { name: '200L', value: 120 },
          { name: '300L', value: 100 },
          { name: '400L', value: 80 },
        ]
      );

      setDepartmentStats(
        data.departmentData || [
          { name: 'Engineering', students: 250 },
          { name: 'Science', students: 200 },
          { name: 'Arts', students: 180 },
          { name: 'Medicine', students: 150 },
        ]
      );
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: '#2C3E50' }}>
        Admin Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Total Students"
            value={stats?.totalStudents?.toLocaleString() || '0'}
            icon={SchoolIcon}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Total Staff"
            value={stats?.totalStaff?.toLocaleString() || '0'}
            icon={PeopleIcon}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Total Courses"
            value={stats?.totalCourses?.toLocaleString() || '0'}
            icon={BookIcon}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Faculties"
            value={stats?.totalFaculties?.toLocaleString() || '0'}
            icon={AssignmentIcon}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Departments"
            value={stats?.totalDepartments?.toLocaleString() || '0'}
            icon={AssignmentIcon}
            color="error"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <ChartCard title="Student Distribution" subtitle="By Academic Level">
            <PieChartComponent data={studentDistribution} name="Students" />
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard title="Department Statistics" subtitle="Students per Department">
            <BarChartComponent
              data={departmentStats}
              dataKey="students"
              name="Students"
              color="#0F4C81"
            />
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
