import React from "react";
import Nav from "./Nav";
import Feed from "./Feed";
import InputTogo from "./InputTogo";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#35baf6',
      main: '#03a9f4',
      dark: '#0276aa',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ffcf33',
      main: '#ffc400',
      dark: '#b28900',
      contrastText: '#000',
    },
  },
});

const App = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
      <Nav/>
      <InputTogo/>
      <Feed/>
      </ThemeProvider>
    </>
  );
};

export default App;
