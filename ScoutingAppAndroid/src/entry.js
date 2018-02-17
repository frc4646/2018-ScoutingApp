import React, { Component } from 'react';
import {
  RootDrawerNavigator as App
} from './navigators/RootDrawer';
import { ThemeProvider } from 'react-native-material-ui';

export default () => (
  <ThemeProvider uiTheme={{}}>
    <App />
  </ThemeProvider>
);

