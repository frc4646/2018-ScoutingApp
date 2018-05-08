/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  NativeModules,
  ScrollView,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Alert,
  Dimensions
} from 'react-native';
import { COLOR, ThemeProvider, Subheader, Checkbox, RadioButton, IconToggle, Color, Button } from 'react-native-material-ui';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import _ from 'lodash';
import firebase from 'react-native-firebase';
import { StackNavigator, TabNavigator, withNavigation } from 'react-navigation';
import Orientation from 'react-native-orientation';

export const db = firebase.firestore();

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

class RowColor extends Component {
  render() {
    const {data, style, widthArr, height, flexArr, textStyle, borderStyle, dataRow} = this.props;
    let widthNum = 0;
    if (widthArr) {
      for(let i=0; i<widthArr.length; i++) {
          widthNum += 60;
      }
    }

    const styles = StyleSheet.create({
      row: {
        flexDirection: 'row',
        overflow: 'hidden'
      },
    })

    return (
      data ?
      <View style={{flexDirection:'row'}}>
        {
          _.chunk(data, 3).map((row, i) => (
            <View style={[
              height && {height: height},
              widthNum && {width: widthNum / 2},
              styles.row,
              style,
              (i % 2) ? {backgroundColor: '#00BFFF'} : {backgroundColor: '#FF0000'}
            ]} key={i} dataExtrainous={i % 2}>
              {
                row.map((item, i) => {
                  const flex = flexArr && flexArr[i];
                  const width = widthArr && widthArr[i];
                  return <TouchableHighlight onPress={() => {
                    console.log('Pressed');
                    /*Alert.alert(
                      `${i} ${dataRow} ${item}`,
                      'My Alert Msg',
                      [
                        {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: 'OK', onPress: () => console.log('OK Pressed')},
                      ],
                      { cancelable: true }
                    )*/
                    this.props.navigation.navigate('ScoutTeam', {
                      team: item,
                      match: dataRow + 1,
                    });
                  }} key={i}>
                    <Cell data={item} width={width} height={height} flex={1} textStyle={textStyle} borderStyle={borderStyle} />
                  </TouchableHighlight>
                })
              }
            </View>
          ))
        }
      </View>
      : null
    )
  }
}

class ScoutTeam extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
      section: 'auto',
    }

    console.log(props.navigation.state.params);

    this.tbd = db.collection('teams')
      .doc(`${props.navigation.state.params.team}`)
      .collection('matches')
      .doc(`${props.navigation.state.params.match}`);
  }

  componentDidMount() {
    Orientation.lockToLandscape();
    
    this.tbd.get().then((initalData) => {
      let data = {};

      if (!initalData.exists) {
        this.tbd.set(data = {
          autoCross: false,
          autoCubePickup: false,
          autoCubePickupLocation: "pile",
          autoCubeWrong: false,
          autoCubeWrongCount: 0,
          autoSwitchCube: false,
          autoSwitchCubeCount: 0,
          endgameClimbLocation: "center",
          endgameClimbStatus: 0,
          powerupBoost: false,
          powerupBoostCount: 0,
          powerupForce: false,
          powerupForceCount: 0,
          powerupLevitate: false,
          startingPosition: "middle",
          teleopAllianceSwitchCube: false,
          teleopAllianceSwitchCubeCount: 0,
          teleopAllianceSwitchCubeWrong: false,
          teleopAllianceSwitchCubeWrongCount: 0,
          teleopDefense: false,
          teleopExchangeCube: false,
          teleopExchangeCubeCount: 0,
          teleopOpponentSwitchCube: false,
          teleopOpponentSwitchCubeCount: 0,
          teleopOpponentSwitchCubeWrong: false,
          teleopOpponentSwitchCubeWrongCount: 0,
          teleopScaleCube: false,
          teleopScaleCubeCount: 0,
          teleopScaleCubeWrong: false,
          teleopScaleCubeWrongCount: 0,
        });
      } else {
        data = initalData.data();
      }

      this.setState({
        dataSource: data,
        db: this.tbd,
      });

      this.listenOnTeamPointer();
    });
  }

  listenOnTeamPointer() {
    this.state.db.onSnapshot((data) => {
      console.log(data.data(), 'TeamPointerUpdate');
      this.setState({
        dataSource: data.data(),
      });
    });
  }

  toggleCheck(name) {
    this.updateValue(
      name,
      !!!this.getMatchItemState(name)
    );
  }

  updateValue(name, value) {
    this.state.db.update({
      [name]: value,
    });
  }

  getMatchItemState(name) {
    return this.state.dataSource[name];
  }

  render() {
    return (
      <View style={{flex: 1,justifyContent: 'flex-start',alignItems: 'flex-start'}}>
        <View style={[(this.state.section == 'auto' ? null : {display: 'none'}), {flex: 1,justifyContent: 'flex-start',alignItems: 'flex-start'}]}>
          <Subheader text={`Auto - Match: ${this.props.navigation.state.params.match} Team: ${this.props.navigation.state.params.team}`} />
          <View style={{flex: 1,justifyContent: 'flex-start',alignItems: 'flex-start',flexDirection: 'row', paddingLeft: 16}}>
            <View style={{flex: 1/5,justifyContent: 'flex-start',alignItems: 'center'}}>
              <Text>Crossed Auto Line</Text>
              <View style={{height: 48}}>
                <Checkbox
                  checked={!!this.getMatchItemState('autoCross')}
                  onCheck={() => this.toggleCheck('autoCross')}
                  value="autoCross"
                  label=""
                  size={36}
                />
              </View>
            </View>
            <View style={{flex: 1/5, justifyContent: 'flex-start', alignItems: 'center'}}>
              <Text>Picked Up Cube</Text>
              <View style={{height: 48}}>
                <Checkbox
                  checked={!!this.getMatchItemState('autoCubePickup')}
                  onCheck={() => this.toggleCheck('autoCubePickup')}
                  value="autoCubePickup"
                  label=""
                  size={36}              
                />
              </View>
              <View style={[{alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1/2}, (!!!!this.getMatchItemState('autoCubePickup') || false) ? null : {display: 'none'}]}>
                <RadioButton
                  label="Human"
                  checked={(this.getMatchItemState('autoCubePickupLocation') || 'pile') == 'human'}
                  value="human"
                  onSelect={value => this.updateValue('autoCubePickupLocation', value)}
                />
                <RadioButton
                  label="Pile"
                  checked={(this.getMatchItemState('autoCubePickupLocation') || 'pile') == 'pile'}
                  value="pile"
                  onSelect={value => this.updateValue('autoCubePickupLocation', value)}
                />
                <RadioButton
                  label="Switch"
                  checked={(this.getMatchItemState('autoCubePickupLocation') || 'pile') == 'switch'}
                  value="switch"
                  onSelect={value => this.updateValue('autoCubePickupLocation', value)}
                />
              </View>
            </View>
            <View style={{flex: 1/5}}>
              <Text>Placed Cube on Switch</Text>
              <View style={[{alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1 }, ((!!this.getMatchItemState('autoSwitchCube') || false) === false /* && (this.getMatchItemState('autoSwitchCubeCount') > 0)*/) ? null : {display: 'none'} ]}>
                <View style={{height: 48}}>
                  <Checkbox
                    checked={!!this.getMatchItemState('autoSwitchCube')}
                    onCheck={() => {
                      if (!!!this.getMatchItemState('autoSwitchCube') === true) {
                        this.updateValue('autoSwitchCubeCount', this.getMatchItemState('autoSwitchCubeCount') + 1)
                      } else {
                        this.updateValue('autoSwitchCubeCount', 0)
                      }

                      this.toggleCheck('autoSwitchCube')                        
                    }}
                    value="autoSwitchCube"
                    label=""
                    size={36}
                  />
                </View>
              </View>
              <View style={[{alignItems: 'center', justifyContent: 'flex-start', flex: 1}, ((!!this.getMatchItemState('autoSwitchCube') || false) === true && (this.getMatchItemState('autoSwitchCubeCount') >= 0)) ?  null : {display: 'none'}]}>
                <IconToggle
                  name="add-circle"
                  color={COLOR.green500}
                  onPress={() => {
                    this.updateValue(
                      'autoSwitchCubeCount',
                      this.getMatchItemState('autoSwitchCubeCount') + 1
                    )
                  }}
                />
                <Text>
                  {this.getMatchItemState('autoSwitchCubeCount')}
                </Text>
                <IconToggle
                  name="remove-circle"
                  color={COLOR.red500}
                  onPress={() => {
                    if ((this.getMatchItemState('autoSwitchCubeCount') - 1) === 0) {
                      this.toggleCheck('autoSwitchCube');
                    }

                    this.updateValue(
                      'autoSwitchCubeCount',
                      this.getMatchItemState('autoSwitchCubeCount') - 1
                    )
                  }}
                />
              </View>
            </View>
            <View style={{flex: 1/5}}>
              <Text>Placed Cube on Wrong Side of Switch</Text>
              <View style={[{alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1 }, ((!!this.getMatchItemState('autoCubeWrong') || false) === false /* && (this.getMatchItemState('autoSwitchCubeCount') > 0)*/) ? null : {display: 'none'} ]}>
                <View style={{height: 48}}>
                  <Checkbox
                    checked={!!this.getMatchItemState('autoCubeWrong')}
                    onCheck={() => {
                      if (!!!this.getMatchItemState('autoCubeWrong') === true) {
                        this.updateValue('autoCubeWrongCount', this.getMatchItemState('autoCubeWrongCount') + 1)
                      } else {
                        this.updateValue('autoCubeWrongCount', 0)
                      }

                      this.toggleCheck('autoCubeWrong')                        
                    }}
                    value="autoCubeWrong"
                    label=""
                    size={36}
                  />
                </View>
              </View>
              <View style={[{alignItems: 'center', justifyContent: 'flex-start', flex: 1}, ((!!this.getMatchItemState('autoCubeWrong') || false) === true && (this.getMatchItemState('autoCubeWrongCount') >= 0)) ?  null : {display: 'none'}]}>
                <IconToggle
                  name="add-circle"
                  color={COLOR.orange500}
                  onPress={() => {
                    this.updateValue(
                      'autoCubeWrongCount',
                      this.getMatchItemState('autoCubeWrongCount') + 1
                    )
                  }}
                />
                <Text>
                  {this.getMatchItemState('autoCubeWrongCount')}
                </Text>
                <IconToggle
                  name="remove-circle"
                  color={COLOR.red500}
                  onPress={() => {
                    if ((this.getMatchItemState('autoCubeWrongCount') - 1) === 0) {
                      this.toggleCheck('autoCubeWrong');
                    }

                    this.updateValue(
                      'autoCubeWrongCount',
                      this.getMatchItemState('autoCubeWrongCount') - 1
                    )
                  }}
                />
              </View>
            </View>
            <View style={{flex: 1/5, justifyContent: 'flex-start', alignItems: 'center'}}>
              <Text>Starting Position</Text>
              <View style={{alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1/2}}>
                <RadioButton
                  label="Field Left"
                  checked={(this.getMatchItemState('startingPosition') || 'middle') == 'left'}
                  value="left"
                  onSelect={value => this.updateValue('startingPosition', value)}
                />
                <RadioButton
                  label="Middle"
                  checked={(this.getMatchItemState('startingPosition') || 'middle') == 'middle'}
                  value="middle"
                  onSelect={value => this.updateValue('startingPosition', value)}
                />
                <RadioButton
                  label="Field Right"
                  checked={(this.getMatchItemState('startingPosition') || 'middle') == 'right'}
                  value="right"
                  onSelect={value => this.updateValue('startingPosition', value)}
                />
              </View>
            </View>
          </View>
          <Button text="Proceed to Teleop" onPress={() => {
            this.setState({
              section: 'teleop'
            })
          }}/>
        </View>
        <View style={[(this.state.section == 'teleop' ? null : {display: 'none'}), {flex: 1,justifyContent: 'flex-start',alignItems: 'flex-start'}]}>
          <Subheader text={`Teleop - Match: ${this.props.navigation.state.params.match} Team: ${this.props.navigation.state.params.team}`} />
            <View style={{flex: 1/3,justifyContent: 'flex-start',alignItems: 'flex-start',flexDirection: 'row', paddingLeft: 16}}>
              <View style={{flex: 1/4}}>
                <Text>Placed Cube on Alliance Switch</Text>
                <View style={[{alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1 }, ((!!this.getMatchItemState('teleopAllianceSwitchCube') || false) === false /* && (this.getMatchItemState('teleopAllianceSwitchCubeCount') > 0)*/) ? null : {display: 'none'} ]}>
                  <View style={{height: 48}}>
                    <Checkbox
                      checked={!!this.getMatchItemState('teleopAllianceSwitchCube')}
                      onCheck={() => {
                        if (!!!this.getMatchItemState('teleopAllianceSwitchCube') === true) {
                          this.updateValue('teleopAllianceSwitchCubeCount', this.getMatchItemState('teleopAllianceSwitchCubeCount') + 1)
                        } else {
                          this.updateValue('teleopAllianceSwitchCubeCount', 0)
                        }

                        this.toggleCheck('teleopAllianceSwitchCube')                        
                      }}
                      value="teleopAllianceSwitchCube"
                      label=""
                      size={36}
                    />
                  </View>
                </View>
                <View style={[{alignItems: 'center', justifyContent: 'flex-start', flex: 1}, ((!!this.getMatchItemState('teleopAllianceSwitchCube') || false) === true && (this.getMatchItemState('teleopAllianceSwitchCubeCount') >= 0)) ?  null : {display: 'none'}]}>
                  <IconToggle
                    name="add-circle"
                    color={COLOR.green500}
                    onPress={() => {
                      this.updateValue(
                        'teleopAllianceSwitchCubeCount',
                        this.getMatchItemState('teleopAllianceSwitchCubeCount') + 1
                      )
                    }}
                  />
                  <Text>
                    {this.getMatchItemState('teleopAllianceSwitchCubeCount')}
                  </Text>
                  <IconToggle
                    name="remove-circle"
                    color={COLOR.red500}
                    onPress={() => {
                      if ((this.getMatchItemState('teleopAllianceSwitchCubeCount') - 1) === 0) {
                        this.toggleCheck('teleopAllianceSwitchCube');
                      }

                      this.updateValue(
                        'teleopAllianceSwitchCubeCount',
                        this.getMatchItemState('teleopAllianceSwitchCubeCount') - 1
                      )
                    }}
                  />
                </View>
              </View>
              <View style={{flex: 1/4}}>
                <Text>Placed Cube on Opponent Switch</Text>
                <View style={[{alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1 }, ((!!this.getMatchItemState('teleopOpponentSwitchCube') || false) === false /* && (this.getMatchItemState('teleopOpponentSwitchCubeCount') > 0)*/) ? null : {display: 'none'} ]}>
                  <View style={{height: 48}}>
                    <Checkbox
                      checked={!!this.getMatchItemState('teleopOpponentSwitchCube')}
                      onCheck={() => {
                        if (!!!this.getMatchItemState('teleopOpponentSwitchCube') === true) {
                          this.updateValue('teleopOpponentSwitchCubeCount', this.getMatchItemState('teleopOpponentSwitchCubeCount') + 1)
                        } else {
                          this.updateValue('teleopOpponentSwitchCubeCount', 0)
                        }

                        this.toggleCheck('teleopOpponentSwitchCube')                        
                      }}
                      value="teleopOpponentSwitchCube"
                      label=""
                      size={36}
                    />
                  </View>
                </View>
                <View style={[{alignItems: 'center', justifyContent: 'flex-start', flex: 1}, ((!!this.getMatchItemState('teleopOpponentSwitchCube') || false) === true && (this.getMatchItemState('teleopOpponentSwitchCubeCount') >= 0)) ?  null : {display: 'none'}]}>
                  <IconToggle
                    name="add-circle"
                    color={COLOR.green500}
                    onPress={() => {
                      this.updateValue(
                        'teleopOpponentSwitchCubeCount',
                        this.getMatchItemState('teleopOpponentSwitchCubeCount') + 1
                      )
                    }}
                  />
                  <Text>
                    {this.getMatchItemState('teleopOpponentSwitchCubeCount')}
                  </Text>
                  <IconToggle
                    name="remove-circle"
                    color={COLOR.red500}
                    onPress={() => {
                      if ((this.getMatchItemState('teleopOpponentSwitchCubeCount') - 1) === 0) {
                        this.toggleCheck('teleopOpponentSwitchCube');
                      }

                      this.updateValue(
                        'teleopOpponentSwitchCubeCount',
                        this.getMatchItemState('teleopOpponentSwitchCubeCount') - 1
                      )
                    }}
                  />
                </View>
              </View>
              <View style={{flex: 1/4}}>
                <Text>Placed Cube on Scale</Text>
                <View style={[{alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1 }, ((!!this.getMatchItemState('teleopScaleCube') || false) === false /* && (this.getMatchItemState('teleopScaleCubeCount') > 0)*/) ? null : {display: 'none'} ]}>
                  <View style={{height: 48}}>
                    <Checkbox
                      checked={!!this.getMatchItemState('teleopScaleCube')}
                      onCheck={() => {
                        if (!!!this.getMatchItemState('teleopScaleCube') === true) {
                          this.updateValue('teleopScaleCubeCount', this.getMatchItemState('teleopScaleCubeCount') + 1)
                        } else {
                          this.updateValue('teleopScaleCubeCount', 0)
                        }

                        this.toggleCheck('teleopScaleCube')                        
                      }}
                      value="teleopScaleCube"
                      label=""
                      size={36}
                    />
                  </View>
                </View>
                <View style={[{alignItems: 'center', justifyContent: 'flex-start', flex: 1}, ((!!this.getMatchItemState('teleopScaleCube') || false) === true && (this.getMatchItemState('teleopScaleCubeCount') >= 0)) ?  null : {display: 'none'}]}>
                  <IconToggle
                    name="add-circle"
                    color={COLOR.green500}
                    onPress={() => {
                      this.updateValue(
                        'teleopScaleCubeCount',
                        this.getMatchItemState('teleopScaleCubeCount') + 1
                      )
                    }}
                  />
                  <Text>
                    {this.getMatchItemState('teleopScaleCubeCount')}
                  </Text>
                  <IconToggle
                    name="remove-circle"
                    color={COLOR.red500}
                    onPress={() => {
                      if ((this.getMatchItemState('teleopScaleCubeCount') - 1) === 0) {
                        this.toggleCheck('teleopScaleCube');
                      }

                      this.updateValue(
                        'teleopScaleCubeCount',
                        this.getMatchItemState('teleopScaleCubeCount') - 1
                      )
                    }}
                  />
                </View>
              </View>
              <View style={{flex: 1/4}}>
                <Text>Placed Cube thru Exchange</Text>
                <View style={[{alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1 }, ((!!this.getMatchItemState('teleopExchangeCube') || false) === false /* && (this.getMatchItemState('teleopExchangeCubeCount') > 0)*/) ? null : {display: 'none'} ]}>
                  <View style={{height: 48}}>
                    <Checkbox
                      checked={!!this.getMatchItemState('teleopExchangeCube')}
                      onCheck={() => {
                        if (!!!this.getMatchItemState('autoCubeWrong') === true) {
                          this.updateValue('teleopExchangeCubeCount', this.getMatchItemState('teleopExchangeCubeCount') + 1)
                        } else {
                          this.updateValue('teleopExchangeCubeCount', 0)
                        }

                        this.toggleCheck('teleopExchangeCube')                        
                      }}
                      value="teleopExchangeCube"
                      label=""
                      size={36}
                    />
                  </View>
                </View>
                <View style={[{alignItems: 'center', justifyContent: 'flex-start', flex: 1}, ((!!this.getMatchItemState('teleopExchangeCube') || false) === true && (this.getMatchItemState('teleopExchangeCubeCount') >= 0)) ?  null : {display: 'none'}]}>
                  <IconToggle
                    name="add-circle"
                    color={COLOR.green500}
                    onPress={() => {
                      this.updateValue(
                        'teleopExchangeCubeCount',
                        this.getMatchItemState('teleopExchangeCubeCount') + 1
                      )
                    }}
                  />
                  <Text>
                    {this.getMatchItemState('teleopExchangeCubeCount')}
                  </Text>
                  <IconToggle
                    name="remove-circle"
                    color={COLOR.red500}
                    onPress={() => {
                      if ((this.getMatchItemState('teleopExchangeCubeCount') - 1) === 0) {
                        this.toggleCheck('teleopExchangeCube');
                      }

                      this.updateValue(
                        'teleopExchangeCubeCount',
                        this.getMatchItemState('teleopExchangeCubeCount') - 1
                      )
                    }}
                  />
                </View>
              </View>
            </View>
            <View style={{flex: 1/3,justifyContent: 'flex-start',alignItems: 'flex-start',flexDirection: 'row', paddingLeft: 16}}>
              <View style={{flex: 1/4}}>
                <Text>Placed Cube on Wrong Side of Switch</Text>
                <View style={[{alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1 }, ((!!this.getMatchItemState('autoCubeWrong') || false) === false /* && (this.getMatchItemState('autoSwitchCubeCount') > 0)*/) ? null : {display: 'none'} ]}>
                  <View style={{height: 48}}>
                    <Checkbox
                      checked={!!this.getMatchItemState('autoCubeWrong')}
                      onCheck={() => {
                        if (!!!this.getMatchItemState('autoCubeWrong') === true) {
                          this.updateValue('autoCubeWrongCount', this.getMatchItemState('autoCubeWrongCount') + 1)
                        } else {
                          this.updateValue('autoCubeWrongCount', 0)
                        }

                        this.toggleCheck('autoCubeWrong')                        
                      }}
                      value="autoCubeWrong"
                      label=""
                      size={36}
                    />
                  </View>
                </View>
                <View style={[{alignItems: 'center', justifyContent: 'flex-start', flex: 1}, ((!!this.getMatchItemState('autoCubeWrong') || false) === true && (this.getMatchItemState('autoCubeWrongCount') >= 0)) ?  null : {display: 'none'}]}>
                  <IconToggle
                    name="add-circle"
                    color={COLOR.orange500}
                    onPress={() => {
                      this.updateValue(
                        'autoCubeWrongCount',
                        this.getMatchItemState('autoCubeWrongCount') + 1
                      )
                    }}
                  />
                  <Text>
                    {this.getMatchItemState('autoCubeWrongCount')}
                  </Text>
                  <IconToggle
                    name="remove-circle"
                    color={COLOR.red500}
                    onPress={() => {
                      if ((this.getMatchItemState('autoCubeWrongCount') - 1) === 0) {
                        this.toggleCheck('autoCubeWrong');
                      }

                      this.updateValue(
                        'autoCubeWrongCount',
                        this.getMatchItemState('autoCubeWrongCount') - 1
                      )
                    }}
                  />
                </View>
              </View>
              <View style={{flex: 1/4}}>
                <Text>Placed Cube on Wrong Side of Switch</Text>
                <View style={[{alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1 }, ((!!this.getMatchItemState('autoCubeWrong') || false) === false /* && (this.getMatchItemState('autoSwitchCubeCount') > 0)*/) ? null : {display: 'none'} ]}>
                  <View style={{height: 48}}>
                    <Checkbox
                      checked={!!this.getMatchItemState('autoCubeWrong')}
                      onCheck={() => {
                        if (!!!this.getMatchItemState('autoCubeWrong') === true) {
                          this.updateValue('autoCubeWrongCount', this.getMatchItemState('autoCubeWrongCount') + 1)
                        } else {
                          this.updateValue('autoCubeWrongCount', 0)
                        }

                        this.toggleCheck('autoCubeWrong')                        
                      }}
                      value="autoCubeWrong"
                      label=""
                      size={36}
                    />
                  </View>
                </View>
                <View style={[{alignItems: 'center', justifyContent: 'flex-start', flex: 1}, ((!!this.getMatchItemState('autoCubeWrong') || false) === true && (this.getMatchItemState('autoCubeWrongCount') >= 0)) ?  null : {display: 'none'}]}>
                  <IconToggle
                    name="add-circle"
                    color={COLOR.orange500}
                    onPress={() => {
                      this.updateValue(
                        'autoCubeWrongCount',
                        this.getMatchItemState('autoCubeWrongCount') + 1
                      )
                    }}
                  />
                  <Text>
                    {this.getMatchItemState('autoCubeWrongCount')}
                  </Text>
                  <IconToggle
                    name="remove-circle"
                    color={COLOR.red500}
                    onPress={() => {
                      if ((this.getMatchItemState('autoCubeWrongCount') - 1) === 0) {
                        this.toggleCheck('autoCubeWrong');
                      }

                      this.updateValue(
                        'autoCubeWrongCount',
                        this.getMatchItemState('autoCubeWrongCount') - 1
                      )
                    }}
                  />
                </View>
              </View>
              <View style={{flex: 1/4}}>
                <Text>Placed Cube on Wrong Side of Switch</Text>
                <View style={[{alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1 }, ((!!this.getMatchItemState('autoCubeWrong') || false) === false /* && (this.getMatchItemState('autoSwitchCubeCount') > 0)*/) ? null : {display: 'none'} ]}>
                  <View style={{height: 48}}>
                    <Checkbox
                      checked={!!this.getMatchItemState('autoCubeWrong')}
                      onCheck={() => {
                        if (!!!this.getMatchItemState('autoCubeWrong') === true) {
                          this.updateValue('autoCubeWrongCount', this.getMatchItemState('autoCubeWrongCount') + 1)
                        } else {
                          this.updateValue('autoCubeWrongCount', 0)
                        }

                        this.toggleCheck('autoCubeWrong')                        
                      }}
                      value="autoCubeWrong"
                      label=""
                      size={36}
                    />
                  </View>
                </View>
                <View style={[{alignItems: 'center', justifyContent: 'flex-start', flex: 1}, ((!!this.getMatchItemState('autoCubeWrong') || false) === true && (this.getMatchItemState('autoCubeWrongCount') >= 0)) ?  null : {display: 'none'}]}>
                  <IconToggle
                    name="add-circle"
                    color={COLOR.orange500}
                    onPress={() => {
                      this.updateValue(
                        'autoCubeWrongCount',
                        this.getMatchItemState('autoCubeWrongCount') + 1
                      )
                    }}
                  />
                  <Text>
                    {this.getMatchItemState('autoCubeWrongCount')}
                  </Text>
                  <IconToggle
                    name="remove-circle"
                    color={COLOR.red500}
                    onPress={() => {
                      if ((this.getMatchItemState('autoCubeWrongCount') - 1) === 0) {
                        this.toggleCheck('autoCubeWrong');
                      }

                      this.updateValue(
                        'autoCubeWrongCount',
                        this.getMatchItemState('autoCubeWrongCount') - 1
                      )
                    }}
                  />
                </View>
              </View>
            </View>
            <View style={{flex: 1/3,justifyContent: 'flex-start',alignItems: 'flex-start',flexDirection: 'row', paddingLeft: 16}}>
              <View style={{flex: 1/5,justifyContent: 'flex-start',alignItems: 'center'}}>
                <Text>Played Defense</Text>
                <View style={{height: 48}}>
                  <Checkbox
                    checked={!!this.getMatchItemState('autoCross')}
                    onCheck={() => this.toggleCheck('autoCross')}
                    value="autoCross"
                    label=""
                    size={36}
                  />
                </View>
              </View>
              <View style={{flex: 1/4}}>
                <Text>Force Powerup</Text>
                <View style={[{alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1 }, ((!!this.getMatchItemState('teleopOpponentSwitchCube') || false) === false /* && (this.getMatchItemState('teleopOpponentSwitchCubeCount') > 0)*/) ? null : {display: 'none'} ]}>
                  <View style={{height: 48}}>
                    <Checkbox
                      checked={!!this.getMatchItemState('teleopOpponentSwitchCube')}
                      onCheck={() => {
                        if (!!!this.getMatchItemState('teleopOpponentSwitchCube') === true) {
                          this.updateValue('teleopOpponentSwitchCubeCount', this.getMatchItemState('teleopOpponentSwitchCubeCount') + 1)
                        } else {
                          this.updateValue('teleopOpponentSwitchCubeCount', 0)
                        }

                        this.toggleCheck('teleopOpponentSwitchCube')                        
                      }}
                      value="teleopOpponentSwitchCube"
                      label=""
                      size={36}
                    />
                  </View>
                </View>
                <View style={[{alignItems: 'center', justifyContent: 'flex-start', flex: 1}, ((!!this.getMatchItemState('teleopOpponentSwitchCube') || false) === true && (this.getMatchItemState('teleopOpponentSwitchCubeCount') >= 0)) ?  null : {display: 'none'}]}>
                  <IconToggle
                    name="add-circle"
                    color={COLOR.green500}
                    onPress={() => {
                      this.updateValue(
                        'teleopOpponentSwitchCubeCount',
                        this.getMatchItemState('teleopOpponentSwitchCubeCount') + 1
                      )
                    }}
                  />
                  <Text>
                    {this.getMatchItemState('teleopOpponentSwitchCubeCount')}
                  </Text>
                  <IconToggle
                    name="remove-circle"
                    color={COLOR.red500}
                    onPress={() => {
                      if ((this.getMatchItemState('teleopOpponentSwitchCubeCount') - 1) === 0) {
                        this.toggleCheck('teleopOpponentSwitchCube');
                      }

                      this.updateValue(
                        'teleopOpponentSwitchCubeCount',
                        this.getMatchItemState('teleopOpponentSwitchCubeCount') - 1
                      )
                    }}
                  />
                </View>
              </View>
              <View style={{flex: 1/4}}>
                <Text>Boost Powerup</Text>
                <View style={[{alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1 }, ((!!this.getMatchItemState('teleopScaleCube') || false) === false /* && (this.getMatchItemState('teleopScaleCubeCount') > 0)*/) ? null : {display: 'none'} ]}>
                  <View style={{height: 48}}>
                    <Checkbox
                      checked={!!this.getMatchItemState('teleopScaleCube')}
                      onCheck={() => {
                        if (!!!this.getMatchItemState('teleopScaleCube') === true) {
                          this.updateValue('teleopScaleCubeCount', this.getMatchItemState('teleopScaleCubeCount') + 1)
                        } else {
                          this.updateValue('teleopScaleCubeCount', 0)
                        }

                        this.toggleCheck('teleopScaleCube')                        
                      }}
                      value="teleopScaleCube"
                      label=""
                      size={36}
                    />
                  </View>
                </View>
                <View style={[{alignItems: 'center', justifyContent: 'flex-start', flex: 1}, ((!!this.getMatchItemState('teleopScaleCube') || false) === true && (this.getMatchItemState('teleopScaleCubeCount') >= 0)) ?  null : {display: 'none'}]}>
                  <IconToggle
                    name="add-circle"
                    color={COLOR.green500}
                    onPress={() => {
                      this.updateValue(
                        'teleopScaleCubeCount',
                        this.getMatchItemState('teleopScaleCubeCount') + 1
                      )
                    }}
                  />
                  <Text>
                    {this.getMatchItemState('teleopScaleCubeCount')}
                  </Text>
                  <IconToggle
                    name="remove-circle"
                    color={COLOR.red500}
                    onPress={() => {
                      if ((this.getMatchItemState('teleopScaleCubeCount') - 1) === 0) {
                        this.toggleCheck('teleopScaleCube');
                      }

                      this.updateValue(
                        'teleopScaleCubeCount',
                        this.getMatchItemState('teleopScaleCubeCount') - 1
                      )
                    }}
                  />
                </View>
              </View>
              <View style={{flex: 1/4}}>
                <Text>Levitate Powerup</Text>
                <View style={[{alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1 }, ((!!this.getMatchItemState('autoCubeWrong') || false) === false /* && (this.getMatchItemState('autoSwitchCubeCount') > 0)*/) ? null : {display: 'none'} ]}>
                  <View style={{height: 48}}>
                    <Checkbox
                      checked={!!this.getMatchItemState('autoCubeWrong')}
                      onCheck={() => {
                        if (!!!this.getMatchItemState('autoCubeWrong') === true) {
                          this.updateValue('autoCubeWrongCount', this.getMatchItemState('autoCubeWrongCount') + 1)
                        } else {
                          this.updateValue('autoCubeWrongCount', 0)
                        }

                        this.toggleCheck('autoCubeWrong')                        
                      }}
                      value="autoCubeWrong"
                      label=""
                      size={36}
                    />
                  </View>
                </View>
                <View style={[{alignItems: 'center', justifyContent: 'flex-start', flex: 1}, ((!!this.getMatchItemState('autoCubeWrong') || false) === true && (this.getMatchItemState('autoCubeWrongCount') >= 0)) ?  null : {display: 'none'}]}>
                  <IconToggle
                    name="add-circle"
                    color={COLOR.orange500}
                    onPress={() => {
                      this.updateValue(
                        'autoCubeWrongCount',
                        this.getMatchItemState('autoCubeWrongCount') + 1
                      )
                    }}
                  />
                  <Text>
                    {this.getMatchItemState('autoCubeWrongCount')}
                  </Text>
                  <IconToggle
                    name="remove-circle"
                    color={COLOR.red500}
                    onPress={() => {
                      if ((this.getMatchItemState('autoCubeWrongCount') - 1) === 0) {
                        this.toggleCheck('autoCubeWrong');
                      }

                      this.updateValue(
                        'autoCubeWrongCount',
                        this.getMatchItemState('autoCubeWrongCount') - 1
                      )
                    }}
                  />
                </View>
              </View>
          </View>
        </View>
      </View>
    )
  }
}

class What extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: []
    };

    this.matchDb = db.collection('matches');
  }

  componentDidMount() {
    Orientation.lockToLandscape();

    this.matchDb.onSnapshot(snapshot => {
      let map = [];

      snapshot.forEach(doc => {
        map.push(doc.data());
      });

      console.log(map);

      this.setState({ dataSource: map });
    });
  }


  render() {
    let x = [];
    _.forEach(this.state.dataSource, (a) => {
      console.log(a);
      x.push([
        a.number,
        a.red[0],
        a.red[1],
        a.red[2],
        a.blue[0],
        a.blue[1],
        a.blue[2],
      ]);
    });

    const styles = StyleSheet.create({
      table: { /*width: 360,*/ flexDirection: 'row' },
      head: { backgroundColor: '#333', height: 40 },
      headText: { color: '#fff', textAlign: 'center' },
      titleText: {textAlign: 'center', marginLeft: 6 },
      list: { height: 48 },
      listText: { textAlign: 'center', marginRight: 6 }
    });

    const tableHead = ['Red 1', 'Red 2', 'Red 3', 'Blue 1', 'Blue 2', 'Blue 3'];
    const tableTitle = (() => {
      return _.map(x, (k) => {
        return k[0];
      });
    })()/*['0', '1', '2', '3', '4']*/;
    const tableData = (() => {
      let e = [];
      _.forEach(x, (rw) => {
        console.log(rw);
        e.push([rw[1], rw[2], rw[3], rw[4], rw[5], rw[6]]);
      });

      return e;
    })();
    const widthArr = [60, 60, 60, 60, 60, 60];

    console.log(tableData);

    return (
      <View style={gstyles.container}>
        <View style={gstyles.container}>
          <Table style={styles.table}>
            {/* Left Wrapper */}
            <TableWrapper style={{width: 80}}>
              <Cell data="Match" style={styles.head} textStyle={styles.headText}/>
              {
                tableTitle.map((title, i) => (
                  <Cell key={i} data={title} height={48} style={i%2 && {backgroundColor: '#DFF5F2'}} textStyle={styles.titleText}/>
                ))
              }
            </TableWrapper>

            {/* Right scrollview Wrapper */}
            <ScrollView horizontal={false}>
              {/* If parent element is not table element, you should add the type of borderstyle. */}
              <TableWrapper borderStyle={{borderWidth: 1,borderColor: '#000',}}>
                <Row data={tableHead} style={styles.head} textStyle={styles.headText} widthArr={widthArr}/>
                {
                  tableData.map((data, i) => (
                    <RowColor navigation={this.props.navigation} dataRow={i} key={i} data={data} style={[styles.list, i%2 && {backgroundColor: '#DFF5F2'}]} widthArr={widthArr} textStyle={styles.listText}/>
                  ))
                }
              </TableWrapper>
            </ScrollView>
          </Table>
        </View>
      </View>
    );
  }
}

const RootNavigator = StackNavigator({
  SelectTeam: {
    screen: What
  },
  ScoutTeam: {
    screen: ScoutTeam
  }
}, {
  initialRouteName: 'SelectTeam',
  headerMode: 'none'
});

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      error: false,
    }

    firebase.auth().signInWithEmailAndPassword(
      'meun5@team4646.local', 'duffer678'
    ).catch(error => {
      console.log(error);
      if (error.name.indexOf('user') || error.name.indexOf('email')) {
        this.setState({
          error: true,
          loading: false,
        });
      }
    }).then(_ => {
      this.setState({
        error: false,
        loading: false,
      });
    });
  }

  render() {
    if (this.state.error) {

    }
    return (
      <ThemeProvider uiTheme={{}}>
        {/* <View style={styles.container}> */}
          {/*<What />*/}<RootNavigator />
        {/* </View> */}
      </ThemeProvider>
    );
  }
}

const gstyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
