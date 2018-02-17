//@flow
import React, { Component } from 'react';
import { withStyles } from "material-ui/styles";
import classNames from 'classnames';
import { MainStyles } from "./../styles";
import { db } from '../entry';
import Grid from "material-ui/Grid/Grid";
import Typography from 'material-ui/Typography';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import _ from 'lodash';

export const stringToBoolean = (string) => {
  switch(string.toLowerCase().trim()) {
      case "true": case "yes": case "1":
        return true;
      case "false": case "no": case "0": case null:
        return false;
      default: return Boolean(string);
  }
}

class Root extends Component {
  state = {
    ds: [],
    teamsPointer: {},
  };

  tp = {};

  componentWillMount() {
    let teamsPointer = this.tp = db.collection('teams');
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    
    this.tp.get().then((initialData) => {
      let data = [];

      initialData.forEach(doc => {
        data.push({
          team: doc.id,
          data: doc.data(),
        });
      });

      data.sort(function (a, b) {
        return parseInt(a.team) - parseInt(b.team);
      });

      this.setState({
        ds: data,
        teamsPointer: this.tp,
      });
    });
  }

  getMatchItemState(name) {
    return this.state.ds[name];
  }

  render() {
    const { classes } = this.props;

    console.log(this.state.ds);

    return (
      <Grid container>
        {this.state.ds.map(team => {
          return (
            <Grid key={Math.random()} item xs={3}>
              <Card
                style={{
                  maxWidth: 345,
                }}
                onClick={() => {
                  this.props.history.push(`/results/${team.team}`)
                }}
              >
                <CardMedia
                  style={{
                    height: 200
                  }}
                  image="/build/cat.jpg"
                  title={team.data.robotImage}
                />
                <CardContent>
                  <Typography type="headline" component="h2">
                    {team.data.name}
                  </Typography>
                  <Typography component="p">
                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                    across all continents except Antarctica
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  }
}

class ResultSpecific extends Component {
  state = {
    ds: [],
    team: {},
    teamMatchPointer: {},
    collate: {},
    doneYet: false,
  };

  tmp = {};
  tp = {};

  componentWillMount() {
    let teamMatchPointer = this.tmp = db.collection('teams')
      .doc(this.props.match.params.team)
      .collection('matches');

    let teamPointer = this.tp = db.collection('teams')
      .doc(this.props.match.params.team);
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    this.tmp.get().then((initialData) => {
      let data = [];

      initialData.forEach(doc => {
        data.push({
          number: doc.id,
          data: doc.data(),
        });
      });

      this.setState({
        ds: data,
        teamMatchPointer: this.tmp,
      });

      this.collate();
    });

    this.tp.get().then((initialData) => {
      this.setState({
        team: initialData.data(),
      });
    });
  }

  collate() {
    let collate = {
      autoCross: [],
      autoCross_Count: [],
      autoCubePickup: [],
      autoCubePickup_Count: [],
      autoCubePickupLocation: [],
      autoCubePickupLocation_Count: [],
      autoCubeWrong: [],
      autoCubeWrong_Count: [],
      autoCubeWrongCount: [],
      autoCubeWrongCount_Count: [],
      autoSwitchCube: [],
      autoSwitchCube_Count: [],
      autoSwitchCubeCount: [],
      autoSwitchCubeCount_Count: [],
      endgameClimbLocation: [],
      endgameClimbLocation_Count: [],
      endgameClimbStatus: [],
      endgameClimbStatus_Count: [],
      powerupBoost: [],
      powerupBoostCount: [],
      powerupBoostCount_Count: [],
      powerupBoost_Count: [],
      powerupForce: [],
      powerupForceCount: [],
      powerupForceCount_Count: [],
      powerupForce_Count: [],
      powerupLevitate: [],
      powerupLevitate_Count: [],
      startingPosition: [],
      startingPosition_Count: [],
      teleopAllianceSwitchCube: [],
      teleopAllianceSwitchCubeCount: [],
      teleopAllianceSwitchCubeCount_Count: [],
      teleopAllianceSwitchCubeWrong: [],
      teleopAllianceSwitchCubeWrongCount: [],
      teleopAllianceSwitchCubeWrongCount_Count: [],
      teleopAllianceSwitchCubeWrong_Count: [],
      teleopAllianceSwitchCube_Count: [],
      teleopDefense: [],
      teleopDefense_Count: [],
      teleopExchangeCube: [],
      teleopExchangeCubeCount: [],
      teleopExchangeCubeCount_Count: [],
      teleopExchangeCube_Count: [],
      teleopOpponentSwitchCube: [],
      teleopOpponentSwitchCubeCount: [],
      teleopOpponentSwitchCubeCount_Count: [],
      teleopOpponentSwitchCubeWrong: [],
      teleopOpponentSwitchCubeWrongCount: [],
      teleopOpponentSwitchCubeWrongCount_Count: [],
      teleopOpponentSwitchCubeWrong_Count: [],
      teleopOpponentSwitchCube_Count: [],
      teleopScaleCube: [],
      teleopScaleCubeCount: [],
      teleopScaleCubeCount_Count: [],
      teleopScaleCubeWrong: [],
      teleopScaleCubeWrongCount: [],
      teleopScaleCubeWrongCount_Count: [],
      teleopScaleCubeWrong_Count: [],
      teleopScaleCube_Count: [],
    };
    this.state.ds.forEach((match) => {
      let data = match.data;
      console.log(match.data);

      for (const key in match.data) {
        console.log(key, data[key]);
        collate[key].push(data[key]);
      }

      console.log(collate);
    });

    for (const key in _.clone(collate)) {
      console.log(typeof collate[key][0]);
      if (typeof collate[key][0] === 'number') {
        collate[`${key}_Count`] = [_.sum(collate[key]), 0];
      } else {
        collate[`${key}_Count`] = (z => {
          let count = _.countBy(collate[key]), a =
          _.maxBy(
            _.keys(
              count
            ),
            (o) => count[o]
          );

          return [a, count[a]];
        })();
      }
    }

    console.log(collate);

    this.setState({
      collate: collate,
      doneYet: true,
    })
  }

  getMatchItemState(name) {
    return this.state.ds[name];
  }
  
  render() {
    const { team, collate, doneYet } = this.state;

    if (!doneYet) {
      return (
        <Typography type="headline">
          Loading...
        </Typography>
      );
    }

    return (
      <div>
        <Card>
          <CardMedia
            style={{
              height: 800
            }}
            image={team.robotImage || "/build/cat.jpg"}
            title={team.name}
          />
          <CardContent>
            <Typography type="display4" component="h2">
              {team.name}
            </Typography>
            <Typography component="p">
              Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
              across all continents except Antarctica
            </Typography>
            <Divider style={{
              margin: '1rem 0'
            }} />
            <div>
              <Typography type="display1" gutterBottom>
                Overview
              </Typography>
              <Typography type="title">
                Auto
              </Typography>
              <Divider style={{
                marginBottom: '.5rem'
              }} />
              <Grid container>
                <Grid item xs={3}>
                  <Typography type="body1">
                    Auto Cross: {stringToBoolean(collate['autoCross_Count'][0]) ? 'Yes' : 'No'} - {collate['autoCross_Count'][1]} out of {_.size(collate['autoCross'])} times
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography type="body1">
                    Auto Cube Pickup: {stringToBoolean(collate['autoCubePickup_Count'][0]) ? 'Yes' : 'No'} - {collate['autoCubePickup_Count'][1]} out of {_.size(collate['autoCubePickup'])} times
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography type="body1">
                    Auto Cube Pickup Location: {_.capitalize(collate['autoCubePickupLocation_Count'][0]) || 'undefined'} - {collate['autoCubePickupLocation_Count'][1]} out of {_.size(collate['autoCubePickupLocation'])} times
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography type="body1">
                    Auto Cube on Switch: {stringToBoolean(collate['autoSwitchCube_Count'][0]) ? 'Yes' : 'No'} - {collate['autoSwitchCube_Count'][1]} out of {_.size(collate['autoSwitchCube'])} times
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography type="body1">
                    T# of Auto Cube on Switch: {collate['autoSwitchCubeCount_Count'][0]}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography type="body1">
                    Auto Cube on Wrong Side: {stringToBoolean(collate['autoCubeWrong_Count'][0]) ? 'Yes' : 'No'} - {collate['autoCubeWrong_Count'][1]} out of {_.size(collate['autoCubeWrong'])} times
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography type="body1">
                    T# of Auto Cube on Wrong Side: {collate['autoCubeWrongCount_Count'][0]}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography type="body1">
                    Starting Position: {_.capitalize(collate['startingPosition_Count'][0])} - {collate['startingPosition_Count'][1]} out of {_.size(collate['startingPosition'])} times
                  </Typography>
                </Grid>
                {/* {_.map(_.pickBy(collate, (p, key) => !(_.endsWith(key, '_Count') || _.endsWith(key, 'Count'))), (arg1, arg2) => {
                  console.log(arg1, arg2, collate[`${arg2}_Count`], 'nise');
                  return ( 
                    <Grid item xs={4}>
                      <Typography type="headline">
                        {arg2}: They did {collate[`${arg2}_Count`][0]} - {collate[`${arg2}_Count`][1]} out of {_.size(arg1)} times
                      </Typography>
                    </Grid>
                  );
                })} */}
              </Grid>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}

export const Results = withStyles(MainStyles)(Root);
export const ResultsTeam = withStyles(MainStyles)(ResultSpecific);