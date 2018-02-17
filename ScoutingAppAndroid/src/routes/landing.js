/**
 * @flow
 */

import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';

export default class Landing extends Component {
  render() {
    return (
      <View>
        <Text style={{
          textAlign: 'center',
          justifyContent: 'center',
        }}>
          Welcome
        </Text>
      </View>
    );
  }
}