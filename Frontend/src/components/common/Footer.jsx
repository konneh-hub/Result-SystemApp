import React from 'react';
import { Box, Container, Typography, Link, Divider } from '@mui/material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#2C3E50',
        color: '#FFFFFF',
        py: 3,
        mt: 'auto',
        borderTop: '1px solid #E0E0E0',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '3fr 1fr' }, gap: 3 }}>
          {/* Left Section */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              SLUGHUB Result Management System
            </Typography>
            <Typography variant="body2" sx={{ color: '#BDC3C7', mb: 2 }}>
              A comprehensive result management system for universities.
            </Typography>
          </Box>

          {/* Right Section */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Quick Links
            </Typography>
            <Link href="#" underline="none" sx={{ color: '#BDC3C7', display: 'block', mb: 0.5 }}>
              Support
            </Link>
            <Link href="#" underline="none" sx={{ color: '#BDC3C7', display: 'block', mb: 0.5 }}>
              Documentation
            </Link>
            <Link href="#" underline="none" sx={{ color: '#BDC3C7', display: 'block' }}>
              Contact Us
            </Link>
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#34495E' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: '#95A5A6' }}>
            &copy; {currentYear} SLUGHUB. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: '#95A5A6' }}>
            Version 1.0.0
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
