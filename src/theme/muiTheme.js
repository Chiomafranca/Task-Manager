import { createTheme } from '@mui/material/styles';

const getMuiTheme = (mode = 'light') =>
  createTheme({
    palette: {
      mode,
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
      ...(mode === 'light'
        ? {
            background: {
              default: '#fff',
              paper: '#fff',
            },
            text: {
              primary: '#000',
              secondary: '#555',
            },
          }
        : {
            background: {
              default: '#121212',
              paper: '#1d1d1d',
            },
            text: {
              primary: '#fff',
              secondary: '#bbb',
            },
          }),
    },

  });

export default getMuiTheme;
