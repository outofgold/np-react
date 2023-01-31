import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Dashboard } from './pages/Dashboard';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <Dashboard />
    </ThemeProvider>
  );
}

export default App;
