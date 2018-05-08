import React, { Component } from 'react';
import {
  Text,
  View
} from 'react-native';
import {
  RootDrawerNavigator as App
} from './navigators/RootDrawer';
import { ThemeProvider } from 'react-native-material-ui';

export default () => (
  <ThemeProvider uiTheme={{}}>
    {/* <View>
      <Text>
        Hello
      </Text>
    </View> */}
    <App />
  </ThemeProvider>
);

