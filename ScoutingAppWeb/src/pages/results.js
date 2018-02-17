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
      autoCubePickup: [],
      autoCubePickupLocation: [],
      autoCubeWrong: [],
      autoCubeWrongCount: [],
      autoSwitchCube: [],
      autoSwitchCubeCount: [],
      startingPosition: [],
      teleopAllianceSwitchCube: [],
      teleopAllianceSwitchCubeCount: [],
      teleopAllianceSwitchCubeWrong: [],
      teleopAllianceSwitchCubeWrongCount: [],
      teleopDefense: [],
      teleopExchangeCube: [],
      teleopExchangeCubeCount: [],
      teleopOpponentSwitchCube: [],
      teleopOpponentSwitchCubeCount: [],
      teleopOpponentSwitchCubeWrong: [],
      teleopOpponentSwitchCubeWrongCount: [],
      teleopScaleCube: [],
      teleopScaleCubeCount: [],
      teleopScaleCubeWrong: [],
      teleopScaleCubeWrongCount: [],
      endgameClimbLocation: [],
      endgameClimbStatus: [],
      powerupBoost: [],
      powerupBoostCount: [],
      powerupForce: [],
      powerupForceCount: [],
      powerupLevitate: [],
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
    })
  }

  getMatchItemState(name) {
    return this.state.ds[name];
  }
  
  render() {
    const { team, collate } = this.state;

    console.log(_.pickBy(collate, (p, key) => !_.endsWith(key, '_Count')), 'what');

    return (
      <div>
        <Card>
          <CardMedia
            style={{
              height: 800
            }}
            image={team.robotImage}
            title={team.name}
          />
          <CardContent>
            <Typography type="headline" component="h2">
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
              <Typography type="title">
                Overview
              </Typography>
              <Grid container>
                {_.map(_.pickBy(collate, (p, key) => !(_.endsWith(key, '_Count') || _.endsWith(key, 'Count'))), (arg1, arg2) => {
                  console.log(arg1, arg2, collate[`${arg2}_Count`]);
                  return (
                    <Grid item xs={4}>
                      {arg2}: They did {collate[`${arg2}_Count`][0]} - {collate[`${arg2}_Count`][1]} out of {_.size(arg1)} times {/*LETL*/}
                    </Grid>
                  );
                })}
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