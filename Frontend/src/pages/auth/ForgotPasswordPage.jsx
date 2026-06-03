import React, { useState } from 'react';
import { Box, Card, TextField, Button, Typography, Alert, CircularProgress, Link } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const forgotPasswordSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
});

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { forgotPassword, loading } = useAuth();
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    try {
      setError(null);
      await forgotPassword(data.email);
      setSuccess(true);
      setSuccessMessage(`Password reset link has been sent to ${data.email}`);
      setTimeout(() => navigate('/login'), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    }
  };

  if (success) {
    return (
      <Card sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#27AE60', mb: 2 }}>
            Check Your Email
          </Typography>
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
          <Typography variant="body2" sx={{ color: '#7F8C8D', mb: 3 }}>
            Redirecting to login...
          </Typography>
          <Link component={RouterLink} to="/login" underline="hover" sx={{ color: '#0F4C81' }}>
            Back to Login
          </Link>
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0F4C81', mb: 1 }}>
          Forgot Password?
        </Typography>
        <Typography variant="body2" sx={{ color: '#7F8C8D' }}>
          Enter your email address and we&apos;ll send you a link to reset your password.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
        </Button>
      </form>

      <Box sx={{ textAlign: 'center' }}>
        <Link component={RouterLink} to="/login" underline="hover" sx={{ color: '#0F4C81' }}>
          Back to Login
        </Link>
      </Box>
    </Card>
  );
};

export default ForgotPasswordPage;
