// @flow
import React, { Component } from 'react';
import { render } from 'react-dom';
import { MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import { default as MenuBar } from './MenuBar/Drawer';
import { HashRouter } from 'react-router-dom';
import * as firebase from 'firebase';
import Reboot from 'material-ui/Reboot';
import 'firebase/firestore';

const config = {
  apiKey: "AIzaSyBpsqX1MX18QAl2YhMFp54hvbrKAub_W5o",
  authDomain: "scoutingapp-be1ee.firebaseapp.com",
  databaseURL: "https://scoutingapp-be1ee.firebaseio.com",
  projectId: "scoutingapp-be1ee",
  storageBucket: "scoutingapp-be1ee.appspot.com",
  messagingSenderId: "1022430903929"
};

export const app = firebase.initializeApp(config);
export const db = firebase.firestore();

class ScoutingApp extends Component {
  render() {
    return (
      <MuiThemeProvider theme={createMuiTheme()}>
        <Reboot/>
        <MenuBar />
      </MuiThemeProvider>
    );
  }
};

const Root = () => (
  <HashRouter>
    <ScoutingApp />
  </HashRouter>
);

render(<Root />, document.getElementById('react-root'));