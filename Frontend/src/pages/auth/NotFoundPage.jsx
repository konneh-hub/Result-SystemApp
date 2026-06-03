import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorIcon from '@mui/icons-material/Error';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <ErrorIcon sx={{ fontSize: '4rem', color: '#E74C3C', mb: 2 }} />
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: '#E74C3C' }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ color: '#7F8C8D', mb: 3 }}>
          The page you are looking for doesn&apos;t exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          size="large"
        >
          Go Back Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
