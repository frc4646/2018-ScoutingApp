/**
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  Text,
  View
} from 'react-native';
import {
  StackNavigator,
  DrawerNavigator,
  TabNavigator
} from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Introduction,
  AutoScoutingScreen
} from './../screens';

const DrawerIcon = ({ navigate }) => {
  if (Platform.OS === 'ios') {
    return null;
  }

  return (
    <Icon
      name="md-menu"
      size={28}
      color="black"
      onPress={() => navigate('DrawerOpen')}
      style={{ paddingLeft: 20 }}
    />
  );
}

export const RootStackNavigator = StackNavigator({
  Main: {
    screen: Introduction,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <DrawerIcon {...navigation} />,
      headerStyle: { backgroundColor: '#067a46' }
    }),
  },
});

export const ScoutingTabNavigator = TabNavigator({
  Auto: {
    screen: AutoScoutingScreen,
  },
  Teleop: {
    screen: () => (<View><Text>Teleop</Text></View>),
  }
}, {
  tabBarPosition: 'bottom',
  swipeEnabled: true,
});

export const ScoutingStackNavigator = StackNavigator({
  Root: {
    screen: ScoutingTabNavigator,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <DrawerIcon {...navigation} />,
      headerStyle: { backgroundColor: '#067a46' }
    }),
  }
})

export const RootDrawerNavigator = DrawerNavigator({
  Main: {
    screen: RootStackNavigator,
    navigationOptions: {
      drawerLabel: 'Root'
    }
  },
  Scouting: {
    screen: ScoutingStackNavigator,
    navigationOptions: {
      drawerLabel: 'Scouting'
    }
  }
});