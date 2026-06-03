import * as React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import theme from './utils/theme';
import { AuthProvider } from './contexts/AuthContext';
import Routes from './routes';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
