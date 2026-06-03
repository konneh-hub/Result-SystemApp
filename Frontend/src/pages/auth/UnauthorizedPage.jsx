import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';

const UnauthorizedPage = () => {
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
        <LockIcon sx={{ fontSize: '4rem', color: '#E74C3C', mb: 2 }} />
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#E74C3C' }}>
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ color: '#7F8C8D', mb: 3 }}>
          You don&apos;t have permission to access this page. Please contact your administrator if you believe this is an error.
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

export default UnauthorizedPage;
