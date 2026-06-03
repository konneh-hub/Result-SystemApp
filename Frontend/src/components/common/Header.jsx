import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Divider,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const handleProfileOpen = (e) => {
    setProfileAnchorEl(e.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleNotificationOpen = (e) => {
    setNotificationAnchorEl(e.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    handleProfileClose();
    const roleRoutes = {
      admin: '/admin/users',
      lecturer: '/lecturer/profile',
      hod: '/hod/dashboard',
      dean: '/dean/dashboard',
      exam_officer: '/exam-officer/dashboard',
      student: '/student/profile',
    };
    navigate(roleRoutes[user?.role] || '/login');
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#FFFFFF',
        color: '#2C3E50',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        zIndex: 100,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={onToggleSidebar}
            color="inherit"
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F4C81' }}>
            SLUGHUB
          </Typography>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications */}
          <IconButton
            color="inherit"
            onClick={handleNotificationOpen}
            sx={{ position: 'relative' }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon sx={{ color: '#0F4C81' }} />
            </Badge>
          </IconButton>

          {/* Profile */}
          <IconButton
            onClick={handleProfileOpen}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Avatar
              sx={{
                bgcolor: '#0F4C81',
                width: 32,
                height: 32,
                fontSize: '0.875rem',
              }}
            >
              {user?.firstName?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem disabled>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="caption" sx={{ color: '#7F8C8D' }}>
                {user?.email}
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleProfile}>
            <PersonIcon sx={{ mr: 1, fontSize: '1.25rem' }} />
            My Profile
          </MenuItem>
          <MenuItem>
            <SettingsIcon sx={{ mr: 1, fontSize: '1.25rem' }} />
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1, fontSize: '1.25rem', color: '#E74C3C' }} />
            <Typography sx={{ color: '#E74C3C' }}>Logout</Typography>
          </MenuItem>
        </Menu>

        {/* Notification Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ maxWidth: 400 }}
        >
          <MenuItem>New result uploaded - Math 101</MenuItem>
          <MenuItem>Course registration closed</MenuItem>
          <MenuItem>Result approval pending</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
