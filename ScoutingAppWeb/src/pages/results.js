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
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import _ from 'lodash';
import Paper from 'material-ui/Paper';
import FilterListIcon from 'material-ui-icons/FilterList';
import Collapse from 'material-ui/transitions/Collapse';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField';

//Notice: Initalizing all the properties like this will cause duplicate x_Count_Count indicies, however since the output is static, it does not cause any issues.
const availableThingsToDo = {
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
  autoScaleCube: [],
  autoScaleCube_Count: [],
  autoScaleCubeCount: [],
  autoScaleCubeCount_Count: [],
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

export const stringToBoolean = (string) => {
  switch(string.toLowerCase().trim()) {
      case "true": case "yes": case "1":
        return true;
      case "false": case "no": case "0": case null:
        return false;
      default: return Boolean(string);
  }
}

export const collate = (ds, tp) => {
  let collate = availableThingsToDo;

  console.log(ds, tp, 'Начало здесь')

  ds.forEach((match) => {
    let data = match.data;
    //console.log(match.data);

    for (const key in match.data) {
      //console.log(key, data[key]);
      collate[key].push(data[key]);
    }

    //console.log(collate);
  });

  for (const key in _.clone(collate)) {
    console.log(typeof collate[key][0]);
    if (typeof collate[key][0] === 'number') {
      collate[`${key}_Count`] = [_.sum(collate[key]), 0];
    } else if (typeof collate[key][0] === 'undefined') {
      collate[`${key}_Count`] = ["0", "0"];
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

  collate = _.pickBy(collate, (z, key) => !(_.endsWith(key, '_Count_Count')))

  console.log(collate);
  (() => {
    let q = {};
    _.map(_.pickBy(collate, (z, key) => (_.endsWith(key, 'Count_Count'))), (w, f) => {
      //console.log(w);
      q[f] = _.head(w);
    });
    //q['endgameClimbStatus_Count'] = _.head(data);

    console.log(q, "q");
    
    tp.set(q, {merge: true});
  })()

  return [collate, true];
}

class Root extends Component {
  state = {
    ds: [],
    teamsPointer: {},
    collapseOpen: false,
    queryBits: "",
    queryBitsSort: "",
    queryBitsSortConstraint: "",
  };

  tp = {};

  componentWillMount() {
    let teamsPointer = this.tp = db.collection('teams');
  }

  componentDidMount() {
    this.tp.get().then((initialData) => {
      let data = [];

      initialData.forEach(doc => {
        data.push({
          team: doc.id,
          data: doc.data(),
        });

        let g = this.tp.doc(`${doc.id}`).collection('matches');
        
        g.get().then((da) => {
          collate.apply(this, [da, g]);
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

  updateQuery() {
    console.log(this.state, 'Вы здесь');

    if (!_.includes(['high', 'low', ''], this.state.queryBitsSort)) {
      let operator = "==";
      switch(this.state.queryBitsSort) {
        case 'atleast':
          operator = "<=";
          break;
        case 'morethan':
          operator = "<";
          break;
        case 'lessthan':
          operator = ">=";
          break;
      }

      this.tp.where(`${this.state.queryBits}`, operator, this.state.queryBitsSortConstraint).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
        });
      })
    }
  }

  getMatchItemState(name) {
    return this.state.ds[name];
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid container>   
        <Grid item xs={12}>
          <Paper>
            <IconButton onClick={() => this.setState({collapseOpen: !!!this.state.collapseOpen})}>
              <FilterListIcon />
            </IconButton>
            <Collapse in={this.state.collapseOpen} timeout="auto" unmountOnExit>
              <div>
                <Typography type="body1" component="p">
                  Query
                </Typography>
                <Typography type="body2" component="span">
                  SELECT TEAM WHERE 
                </Typography>
                <div>
                  <Select
                    value={this.state.queryBits}
                    onChange={(e) => {
                      this.setState({queryBits: e.target.value});
                      this.updateQuery()
                    }}
                  >
                    {_.map({
                      autoCross: [],
                      autoSwitchCube: [],
                      autoScaleCube: [],
                      teleopAllianceSwitchCube: [],
                      teleopExchangeCube: [],
                      teleopDefense: [],
                      teleopOpponentSwitchCube: [],
                      teleopScaleCube: [],
                      endgameClimbStatus: [],
                    }, (z, key) => {
                      return (
                        <MenuItem value={key} key={Math.random()}>
                          {_.startCase(key)}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <Select
                    value={this.state.queryBitsSort}
                    onChange={(e) => {
                      this.setState({queryBitsSort: e.target.value})
                      this.updateQuery()
                    }}
                  >
                    {(() => {
                      let h = [];
                      switch (this.state.queryBits) {
                        case "endgameClimbStatus":
                          h = [
                            {value: "is"}
                          ];
                          break;
                        default:
                          h = [
                            {value: "low"},
                            {value: "high"},
                            {value: "atleast"},
                            {value: "equal"},
                            {value: "lessthan"},
                            {value: "morethan"},
                          ];
                          break;
                      }

                      return h.map((o) => {
                        return (
                          <MenuItem key={'hmod' + Math.random()} value={o.value}>
                            {_.startCase(o.value)}
                          </MenuItem>
                        )
                      });
                    })()}
                  </Select>
                  <TextField
                    value={this.state.queryBitsSortConstraint}
                    onChange={(e) => {
                      this.setState({queryBitsSortConstraint: e.target.value});
                      this.updateQuery()
                    }}
                    className={
                      classNames(_.includes(['low', 'high', ''], this.state.queryBitsSort) ? classes.noDisplay : null)
                    }
                  />
                </div>
              </div>
            </Collapse>
          </Paper>
        </Grid>
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
                    {team.data.nickname} {team.data.number}
                  </Typography>
                  <Typography component="p">
                    {team.data.rookieyear === (new Date).getFullYear() ? 'Rookie' : null}
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
    this.tmp.get().then((initialData) => {
      let data = [];

      initialData.forEach(doc => {
        let k = {
          autoCross: false,
          autoCubePickup: false,
          autoCubePickupLocation: "pile",
          autoCubeWrong: false,
          autoCubeWrongCount: 0,
          autoSwitchCube: false,
          autoSwitchCubeCount: 0,
          autoScaleCube: false,
          autoScaleCubeCount: 0,
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
        };

        if (doc.exists) {
          k = doc.data();
        }

        data.push({
          number: doc.id,
          data: k,
        });
      });

      this.setState({
        ds: data,
        teamMatchPointer: this.tmp,
      });

      this.collate();
      // let t = collate();

      // this.setState({
      //   collate: t[0],
      //   doneYet: t[1],
      // })
    });

    this.tp.get().then((initialData) => {
      this.setState({
        team: initialData.data(),
      });
    });
  }

  collate() {
    console.log(this.state.ds);
    let collate = availableThingsToDo;

    this.state.ds.forEach((match) => {
      let data = match.data;
      //console.log(match.data);

      for (const key in match.data) {
        //console.log(key, data[key]);
        collate[key].push(data[key]);
      }

      //console.log(collate);
    });

    for (const key in _.clone(collate)) {
      console.log(typeof collate[key][0]);
      if (typeof collate[key][0] === 'number') {
        collate[`${key}_Count`] = [_.sum(collate[key]), 0];
      } else if (typeof collate[key][0] === 'undefined') {
        collate[`${key}_Count`] = ["0", "0"];
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

    collate = _.pickBy(collate, (z, key) => !(_.endsWith(key, '_Count_Count')))

    console.log(collate);
    (() => {
      let q = {};
      _.map(_.pickBy(collate, (z, key) => (_.endsWith(key, 'Count_Count'))), (w, f) => {
        //console.log(w);
        q[f] = _.head(w);
      });
      //q['endgameClimbStatus_Count'] = _.head(data);

      console.log(q, "q");
      
      this.tp.set(q, {merge: true});
    })()


    this.setState({
      collate: collate,
      doneYet: true,
    });

    return [collate, true];
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
              height: 650
            }}
            image={team.robotImage || "/build/cat.jpg"}
            title={team.nickname}
          />
          <CardContent>
            <Typography type="display4" component="h2">
              {team.nickname} {team.number}
            </Typography>
            <Typography component="p">
              {team.rookieyear === (new Date).getFullYear() ? 'Rookie' : `Rookie Year: ${team.rookieyear}`}
            </Typography>
            <Typography component="p">
              {team.name}
            </Typography>
            <Divider style={{
              margin: '1rem 0'
            }} />
            <div>
              <Typography type="display1" gutterBottom>
                Overview
              </Typography>
              <Typography type="caption" gutterBottom>
                <span style={{
                  marginRight: '2rem'
                }}>T# = Total Number</span>
                <span style={{
                  marginRight: '2rem'
                }}>{'{Ability Type}: {Average Choice} - X / # of Matches they did that.'}</span>
                <span>{'T# of {Ability Type}: Total Number across all matches they played.'}</span>
              </Typography>
              <div>
                <Typography type="title" component="p">
                  Proven Capabilites <Typography type="caption" style={{display: 'inline-block'}}>(Blank means none)</Typography>
                </Typography>
                <Divider style={{
                  marginBottom: '.5rem'
                }} />
                <Grid container style={{marginBottom: '2rem'}}>
                  {stringToBoolean(collate['autoCross_Count'][0]) ?
                    <Grid item xs={3}>
                      <Typography type="body1">
                        Auto Cross
                      </Typography>
                    </Grid>
                  : null}
                  {stringToBoolean(collate['autoSwitchCube_Count'][0]) ?
                    <Grid item xs={3}>
                      <Typography type="body1">
                        Auto Cube on Switch
                      </Typography>
                    </Grid>
                  : null}
                  {stringToBoolean(collate['autoScaleCube_Count'][0]) ?
                    <Grid item xs={3}>
                      <Typography type="body1">
                        Auto Cube on Scale
                      </Typography>
                    </Grid>
                  : null}
                  {stringToBoolean(collate['autoSwitchCube_Count'][0]) ?
                    <Grid item xs={3}>
                      <Typography type="body1">
                        Auto Cube on Switch
                      </Typography>
                    </Grid>
                  : null}
                  {stringToBoolean(collate['teleopAllianceSwitchCube_Count'][0]) ?
                    <Grid item xs={3}>
                      <Typography type="body1">
                        Teleop Cube on Switch
                      </Typography>
                    </Grid>
                  : null}
                </Grid>
              </div>
              <div>
                <Typography type="title">
                  Auto
                </Typography>
                <Divider style={{
                  marginBottom: '.5rem'
                }} />
                <Grid container>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      Auto Cross: {stringToBoolean(collate['autoCross_Count'][0]) ? 'Yes' : 'No'} - {collate['autoCross_Count'][1]} / {_.size(collate['autoCross'])} 
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      Auto Cube Pickup: {stringToBoolean(collate['autoCubePickup_Count'][0]) ? 'Yes' : 'No'} - {collate['autoCubePickup_Count'][1]} / {_.size(collate['autoCubePickup'])} 
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      Auto Cube Pickup Location: {_.capitalize(collate['autoCubePickupLocation_Count'][0]) || 'undefined'} - {collate['autoCubePickupLocation_Count'][1]} / {_.size(collate['autoCubePickupLocation'])} 
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      Auto Cube on Switch: {stringToBoolean(collate['autoSwitchCube_Count'][0]) ? 'Yes' : 'No'} - {collate['autoSwitchCube_Count'][1]} / {_.size(collate['autoSwitchCube'])} 
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      T# of Auto Cube on Switch: {collate['autoSwitchCubeCount_Count'][0]}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      Auto Cube on Scale: {stringToBoolean(collate['autoScaleCube_Count'][0]) ? 'Yes' : 'No'} - {collate['autoScaleCube_Count'][1]} / {_.size(collate['autoScaleCube'])} 
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      T# of Auto Cube on Scale: {collate['autoScaleCubeCount_Count'][0]}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      Auto Cube on Wrong Side: {stringToBoolean(collate['autoCubeWrong_Count'][0]) ? 'Yes' : 'No'} - {collate['autoCubeWrong_Count'][1]} / {_.size(collate['autoCubeWrong'])} 
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      T# of Auto Cube on Wrong Side: {collate['autoCubeWrongCount_Count'][0]}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      Starting Position: {_.capitalize(collate['startingPosition_Count'][0])} - {collate['startingPosition_Count'][1]} / {_.size(collate['startingPosition'])} 
                    </Typography>
                  </Grid>
                </Grid>
              </div>
              <div>
                <Typography type="title">
                  Teleop
                </Typography>
                <Divider style={{
                  marginBottom: '.5rem'
                }} />
                <Grid container>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      Put Cube on Our Switch: {stringToBoolean(collate['teleopAllianceSwitchCube_Count'][0]) ? 'Yes' : 'No'} - {collate['teleopAllianceSwitchCube_Count'][1]} / {_.size(collate['teleopAllianceSwitchCube'])} 
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      T# of Cube on Our Switch: {collate['teleopAllianceSwitchCubeCount_Count'][0]}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      Put Cube on Opponent Switch: {stringToBoolean(collate['teleopOpponentSwitchCube_Count'][0]) ? 'Yes' : 'No'} - {collate['teleopOpponentSwitchCube_Count'][1]} / {_.size(collate['teleopOpponentSwitchCube'])} 
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      T# of Cube on Opponent Switch: {collate['teleopOpponentSwitchCubeCount_Count'][0]}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      Put Cube on Scale: {stringToBoolean(collate['teleopScaleCube_Count'][0]) ? 'Yes' : 'No'} - {collate['teleopScaleCube_Count'][1]} / {_.size(collate['teleopScaleCube'])} 
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      T# of Cubes on Scale: {collate['teleopScaleCubeCount_Count'][0]}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      Cube on Wrong Side of Our Switch: {stringToBoolean(collate['teleopAllianceSwitchCubeWrong_Count'][0]) ? 'Yes' : 'No'} - {collate['teleopAllianceSwitchCubeWrong_Count'][1]} / {_.size(collate['teleopAllianceSwitchCubeWrong'])} 
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      T# of Cubes on Wrong Side of Our Switch: {collate['teleopAllianceSwitchCubeWrongCount_Count'][0]}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      Cube on Wrong Side of Opp Switch: {stringToBoolean(collate['teleopOpponentSwitchCubeWrong_Count'][0]) ? 'Yes' : 'No'} - {collate['teleopOpponentSwitchCubeWrong_Count'][1]} / {_.size(collate['teleopOpponentSwitchCubeWrong'])} 
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      T# of Cubes on Wrong Side of Opp Switch: {collate['teleopOpponentSwitchCubeWrongCount_Count'][0]}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      Cube on Wrong Side of Scale: {stringToBoolean(collate['teleopAllianceSwitchCubeWrong_Count'][0]) ? 'Yes' : 'No'} - {collate['teleopAllianceSwitchCubeWrong_Count'][1]} / {_.size(collate['teleopAllianceSwitchCubeWrong'])} 
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      T# of Cubes on Wrong Side of Scale: {collate['teleopAllianceSwitchCubeWrongCount_Count'][0]}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      Played Defense: {stringToBoolean(collate['teleopDefense_Count'][0]) ? 'Yes' : 'No'} - {collate['teleopDefense_Count'][1]} / {_.size(collate['teleopDefense'])} 
                    </Typography>
                  </Grid>
                </Grid>
              </div>
              <div>
                <Typography type="title">
                  Powerups
                </Typography>
                <Divider style={{
                  marginBottom: '.5rem'
                }} />
                <Grid container>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      Played Boost: {stringToBoolean(collate['powerupBoost_Count'][0]) ? 'Yes' : 'No'} - {collate['powerupBoost_Count'][1]} / {_.size(collate['powerupBoost'])} - Avg #: {_.mean(collate['powerupBoostCount'])}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      Played Force: {stringToBoolean(collate['powerupForce_Count'][0]) ? 'Yes' : 'No'} - {collate['powerupForce_Count'][1]} / {_.size(collate['powerupForce'])} - Avg #: {_.mean(collate['powerupForceCount'])}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography type="body1">
                      Played Levitate: {stringToBoolean(collate['powerupLevitate_Count'][0]) ? 'Yes' : 'No'} - {collate['powerupLevitate_Count'][1]} / {_.size(collate['powerupLevitate'])} 
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </div>
            <div style={{marginTop: '3rem'}}>
              <Typography type="display1" gutterBottom>
                Match a Match
              </Typography>
              <div>
                {this.state.ds.map((s, indez) => {
                  let valie = s.data;
                  console.log(valie, indez, "Нет, ты здесь");

                  return (
                    <div key={`key-${Math.random()}`}>
                      <Typography type="headline" gutterBottom>
                        Match {s.number}
                      </Typography>
                      <div>
                        <Typography type="title">
                          Auto
                        </Typography>
                        <Divider style={{
                          marginBottom: '.5rem'
                        }} />
                        <Grid container>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              Auto Cross: {valie.autoCross ? 'Yes' : 'No'} 
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              Auto Cube Pickup: {valie.autoCubePickup ? 'Yes' : 'No'} 
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              Auto Cube Pickup Location: {_.capitalize(valie.autoCubePickupLocation) || 'undefined'}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              Auto Cube on Switch: {valie.autoSwitchCube ? 'Yes' : 'No'}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              T# of Auto Cube on Switch: {valie.autoSwitchCubeCount}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              Auto Cube on Scale: {valie.autoScaleCube_Count ? 'Yes' : 'No'}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              T# of Auto Cube on Scale: {valie.autoScaleCubeCount}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              Auto Cube on Wrong Side: {valie.autoCubeWrong ? 'Yes' : 'No'}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              T# of Auto Cube on Wrong Side: {valie.autoCubeWrongCount}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              Starting Position: {_.capitalize(valie.startingPosition)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </div>
                      <div>
                        <Typography type="title">
                          Teleop
                        </Typography>
                        <Divider style={{
                          marginBottom: '.5rem'
                        }} />
                        <Grid container>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              Put Cube on Our Switch: {valie.teleopAllianceSwitchCube ? 'Yes' : 'No'}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              T# of Cube on Our Switch: {valie.teleopAllianceSwitchCubeCount}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              Put Cube on Opponent Switch: {valie.teleopOpponentSwitchCube ? 'Yes' : 'No'}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              T# of Cube on Opponent Switch: {valie.teleopOpponentSwitchCubeCount}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              Put Cube on Scale: {valie.teleopScaleCube ? 'Yes' : 'No'}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              T# of Cubes on Scale: {valie.teleopScaleCubeCount}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              Cube on Wrong Side of Our Switch: {valie.teleopAllianceSwitchCubeWrong ? 'Yes' : 'No'}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              T# of Cubes on Wrong Side of Our Switch: {valie.teleopAllianceSwitchCubeWrongCount}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              Cube on Wrong Side of Opp Switch: {valie.teleopOpponentSwitchCubeWrong ? 'Yes' : 'No'}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              T# of Cubes on Wrong Side of Opp Switch: {valie.teleopOpponentSwitchCubeWrongCount}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              Cube on Wrong Side of Scale: {valie.teleopAllianceSwitchCubeWrong ? 'Yes' : 'No'}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              T# of Cubes on Wrong Side of Scale: {valie.teleopAllianceSwitchCubeWrongCount}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              Played Defense: {valie.teleopDefense_Count ? 'Yes' : 'No'}
                            </Typography>
                          </Grid>
                        </Grid>
                      </div>
                      <div>
                        <Typography type="title">
                          Powerups
                        </Typography>
                        <Divider style={{
                          marginBottom: '.5rem'
                        }} />
                        <Grid container>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              Played Boost: {valie.powerupBoost ? 'Yes' : 'No'} Val: {valie.powerupBoostCount}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              Played Force: {valie.powerupForce ? 'Yes' : 'No'} Val: {valie.powerupForceCount}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography type="body1">
                              Played Levitate: {valie.powerupLevitate ? 'Yes' : 'No'}
                            </Typography>
                          </Grid>
                        </Grid>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}

export const Results = withStyles(MainStyles)(Root);
export const ResultsTeam = withStyles(MainStyles)(ResultSpecific);