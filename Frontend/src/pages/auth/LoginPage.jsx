import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../contexts/AuthContext';

const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(null);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    try {
      setLocalError(null);
      const user = await login(data.email, data.password);
      
      // Redirect based on role
      const roleRoutes = {
        admin: '/admin',
        lecturer: '/lecturer',
        hod: '/hod',
        dean: '/dean',
        exam_officer: '/exam-officer',
        student: '/student',
      };
      
      navigate(roleRoutes[user?.role] || '/');
    } catch (err) {
      setLocalError(error || 'Login failed. Please try again.');
    }
  };

  return (
    <Card
      sx={{
        p: { xs: 3, sm: 4 },
        borderRadius: 2,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Logo/Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#0F4C81', mb: 1 }}>
          SLUGHUB
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#7F8C8D' }}>
          Result Management System
        </Typography>
      </Box>

      {/* Error Alert */}
      {(localError || error) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {localError || error}
        </Alert>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={loading}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        {/* Forgot Password Link */}
        <Box sx={{ textAlign: 'right', mt: 1, mb: 3 }}>
          <Link
            component={RouterLink}
            to="/forgot-password"
            underline="hover"
            sx={{ color: '#0F4C81', fontWeight: 500 }}
          >
            Forgot Password?
          </Link>
        </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          disabled={loading}
          sx={{ mb: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Sign In'}
        </Button>
      </form>

      {/* Demo Credentials */}
      <Box sx={{ mt: 3, p: 2, backgroundColor: '#F0F7FF', borderRadius: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#0F4C81' }}>
          Demo Credentials:
        </Typography>
        <Typography variant="caption" display="block" sx={{ color: '#2C3E50', mt: 0.5 }}>
          Email: admin@university.edu | Password: Admin@123
        </Typography>
      </Box>
    </Card>
  );
};

export default LoginPage;
