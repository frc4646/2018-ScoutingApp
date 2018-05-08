import React, { Component } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';

const CenterStyles = StyleSheet.create({
  flex: {
    flex: 1,
    paddingTop: 6,
  },
  Center: {
    alignItems: 'center',
  },
  CenterCenter: {
    justifyContent: 'center',
  },
  CenterTop: {
    justifyContent: 'flex-start',
  }
});

export class CenterCenterContainer extends Component {
  render() {
    return (
      <View style={[CenterStyles.flex, CenterStyles.Center, CenterStyles.CenterCenter]}>
        {this.props.children}
      </View>
    )
  }
}

export class CenterTopContainer extends Component {
  render() {
    return (
      <View style={[CenterStyles.flex, CenterStyles.Center, CenterStyles.CenterTop]}>
        {this.props.children}
      </View>
    )
  }
}