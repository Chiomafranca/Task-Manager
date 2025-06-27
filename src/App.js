import React from 'react';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import { ShadCNWrapper } from './theme/ShadCNWrapper';
import { ThemeProvider as MuiThemeProvider, CssBaseline, Button, Box } from '@mui/material';
import getMuiTheme from './theme/muiTheme';
import TaskPage from './components/page/TaskPage';

function Content() {
  const { theme, mode, toggleTheme, toggleMode } = useTheme();

  const switchFrameworkLabel = theme === 'mui' 
    ? 'Switch to ShadCN' 
    : 'Switch to MUI';

  const switchModeLabel = mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';

  const buttonStyles = {
    display: 'block',
    margin: '20px auto',
    padding: '12px 24px',
    fontSize: '1rem',
    borderRadius: '30px',
    transition: 'all 0.4s ease',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  };

  if (theme === 'mui') {
    return (
      <MuiThemeProvider theme={getMuiTheme(mode)}>
        <CssBaseline />
        <Box sx={{ p: 2, transition: 'all 0.4s ease' }}>
          <Button variant="contained" onClick={toggleTheme} sx={buttonStyles}>
            {switchFrameworkLabel}
          </Button>
          <Button variant="outlined" onClick={toggleMode} sx={buttonStyles}>
            {switchModeLabel}
          </Button>
          <TaskPage theme="mui" />
        </Box>
      </MuiThemeProvider>
    );
  }

  return (
    <ShadCNWrapper mode={mode}>
      <button
        onClick={toggleTheme}
        style={{
          ...buttonStyles,
          backgroundColor: mode === 'dark' ? '#333' : '#eee',
          color: mode === 'dark' ? '#fff' : '#111',
          border: 'none',
        }}
      >
        {switchFrameworkLabel}
      </button>
      <button
        onClick={toggleMode}
        style={{
          ...buttonStyles,
          backgroundColor: mode === 'dark' ? '#555' : '#ddd',
          color: mode === 'dark' ? '#fff' : '#222',
          border: 'none',
          marginTop: 10,
        }}
      >
        {switchModeLabel}
      </button>
      <TaskPage theme="shadcn" />
    </ShadCNWrapper>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Content />
    </ThemeProvider>
  );
}
