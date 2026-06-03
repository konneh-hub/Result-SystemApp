import React from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Collapse,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import AssignmentIcon from '@mui/icons-material/Assignment';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useState } from 'react';

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  // Define menu items by role
  const getMenuItems = () => {
    const baseMenus = {
      admin: [
        { icon: DashboardIcon, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: PeopleIcon, label: 'Users Management', path: '/admin/users' },
        { icon: SchoolIcon, label: 'Students Management', path: '/admin/students' },
        { icon: PeopleIcon, label: 'Staff Management', path: '/admin/staff' },
        {
          icon: BookIcon,
          label: 'Academic',
          submenu: [
            { label: 'Faculties', path: '/admin/faculties' },
            { label: 'Departments', path: '/admin/departments' },
            { label: 'Programmes', path: '/admin/programmes' },
            { label: 'Courses', path: '/admin/courses' },
          ],
        },
        {
          icon: VerifiedUserIcon,
          label: 'Access Control',
          submenu: [
            { label: 'Roles', path: '/admin/roles' },
            { label: 'Permissions', path: '/admin/permissions' },
          ],
        },
        {
          icon: AssignmentIcon,
          label: 'Reports & Logs',
          submenu: [
            { label: 'Reports', path: '/admin/reports' },
            { label: 'Audit Logs', path: '/admin/audit-logs' },
          ],
        },
        { icon: SettingsIcon, label: 'System Settings', path: '/admin/settings' },
      ],
      lecturer: [
        { icon: DashboardIcon, label: 'Dashboard', path: '/lecturer/dashboard' },
        { icon: BookIcon, label: 'My Courses', path: '/lecturer/courses' },
        {
          icon: AssignmentIcon,
          label: 'Results',
          submenu: [
            { label: 'Upload Results', path: '/lecturer/results/upload' },
            { label: 'Draft Results', path: '/lecturer/results/draft' },
            { label: 'Submitted Results', path: '/lecturer/results/submitted' },
            { label: 'Result History', path: '/lecturer/results/history' },
          ],
        },
        { icon: PeopleIcon, label: 'Profile', path: '/lecturer/profile' },
      ],
      hod: [
        { icon: DashboardIcon, label: 'Dashboard', path: '/hod/dashboard' },
        { icon: SchoolIcon, label: 'Department Students', path: '/hod/students' },
        { icon: PeopleIcon, label: 'Department Lecturers', path: '/hod/lecturers' },
        {
          icon: VerifiedUserIcon,
          label: 'Approvals',
          submenu: [
            { label: 'Pending', path: '/hod/approvals' },
            { label: 'Approved', path: '/hod/approved-results' },
            { label: 'Rejected', path: '/hod/rejected-results' },
          ],
        },
        { icon: AssignmentIcon, label: 'Reports', path: '/hod/reports' },
        { icon: BookIcon, label: 'Graduation', path: '/hod/graduation-recommendations' },
      ],
      dean: [
        { icon: DashboardIcon, label: 'Dashboard', path: '/dean/dashboard' },
        { icon: BookIcon, label: 'Departments', path: '/dean/departments' },
        { icon: AssignmentIcon, label: 'Faculty Results', path: '/dean/results' },
        { icon: VerifiedUserIcon, label: 'Approvals', path: '/dean/approvals' },
        { icon: SchoolIcon, label: 'Statistics', path: '/dean/statistics' },
        { icon: AssignmentIcon, label: 'Reports', path: '/dean/reports' },
      ],
      exam_officer: [
        { icon: DashboardIcon, label: 'Dashboard', path: '/exam-officer/dashboard' },
        { icon: VerifiedUserIcon, label: 'Verify Results', path: '/exam-officer/verify-results' },
        {
          icon: SchoolIcon,
          label: 'GPA Processing',
          submenu: [
            { label: 'GPA', path: '/exam-officer/gpa-processing' },
            { label: 'CGPA', path: '/exam-officer/cgpa-processing' },
          ],
        },
        { icon: AssignmentIcon, label: 'Publish Results', path: '/exam-officer/result-publishing' },
        { icon: BookIcon, label: 'Carry Overs', path: '/exam-officer/carry-overs' },
        { icon: PeopleIcon, label: 'Transcripts', path: '/exam-officer/transcript-requests' },
        { icon: AssignmentIcon, label: 'CSV Uploads', path: '/exam-officer/csv-uploads' },
        { icon: SchoolIcon, label: 'Statistics', path: '/exam-officer/statistics' },
        { icon: AssignmentIcon, label: 'Reports', path: '/exam-officer/reports' },
      ],
      student: [
        { icon: DashboardIcon, label: 'Dashboard', path: '/student/dashboard' },
        { icon: PeopleIcon, label: 'My Profile', path: '/student/profile' },
        { icon: BookIcon, label: 'Course Registration', path: '/student/course-registration' },
        { icon: BookIcon, label: 'Registered Courses', path: '/student/registered-courses' },
        { icon: AssignmentIcon, label: 'Results', path: '/student/results' },
        { icon: SchoolIcon, label: 'GPA', path: '/student/gpa' },
        { icon: SchoolIcon, label: 'CGPA', path: '/student/cgpa' },
        { icon: PeopleIcon, label: 'Transcripts', path: '/student/transcript-request' },
        { icon: AssignmentIcon, label: 'Result Appeals', path: '/student/result-appeals' },
        { icon: AssignmentIcon, label: 'Notifications', path: '/student/notifications' },
      ],
    };

    return baseMenus[userRole] || [];
  };

  const menuItems = getMenuItems();
  const isActive = (path) => location.pathname === path;

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const MenuItemComponent = ({ item, level = 0 }) => {
    if (item.submenu) {
      const isExpanded = expandedMenus[item.label];
      return (
        <>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => toggleSubmenu(item.label)}
              sx={{
                pl: 2 + level * 2,
                color: '#2C3E50',
                '&:hover': { backgroundColor: '#F0F7FF' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.label} />
              {isExpanded ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.submenu.map((submenuItem, idx) => (
                <ListItem key={idx} disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    onClick={() => handleNavigate(submenuItem.path)}
                    sx={{
                      pl: 4 + level * 2,
                      backgroundColor: isActive(submenuItem.path) ? '#E3F2FD' : 'transparent',
                      borderLeft: isActive(submenuItem.path)
                        ? '3px solid #0F4C81'
                        : 'none',
                      color: isActive(submenuItem.path) ? '#0F4C81' : '#2C3E50',
                      fontWeight: isActive(submenuItem.path) ? 600 : 400,
                      '&:hover': { backgroundColor: '#F0F7FF' },
                    }}
                  >
                    <ListItemText primary={submenuItem.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </>
      );
    }

    return (
      <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          onClick={() => handleNavigate(item.path)}
          sx={{
            pl: 2,
            backgroundColor: isActive(item.path) ? '#E3F2FD' : 'transparent',
            borderLeft: isActive(item.path) ? '3px solid #0F4C81' : 'none',
            color: isActive(item.path) ? '#0F4C81' : '#2C3E50',
            fontWeight: isActive(item.path) ? 600 : 400,
            '&:hover': { backgroundColor: '#F0F7FF' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <item.icon />
          </ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? open : true}
      onClose={onClose}
      sx={{
        width: 260,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 260,
          boxSizing: 'border-box',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E0E0E0',
          mt: '64px',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', p: 2 }}>
        <List>
          {menuItems.map((item, idx) => (
            <div key={idx}>
              <MenuItemComponent item={item} />
              {idx < menuItems.length - 1 && item.submenu && <Divider />}
            </div>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
