import * as React from 'react';
import { ThemeProvider } from '@material-ui/core';
import * as ReactDOM from 'react-dom';
import { CacheProvider } from '@emotion/react';
import App from './App';
import theme from './theme';
import createEmotionCache from '../server/createEmotionCache';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from "@material-ui/core";

const cache = createEmotionCache();

function Main() {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </CacheProvider>
  );
}

ReactDOM.hydrate(
    <BrowserRouter>
        <Main />
    </BrowserRouter>, document.querySelector("#root"));
