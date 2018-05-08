//@flow
import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import classNames from "classnames";
import { MainStyles } from "./../styles";
import { db } from './../entry';
import Grid from "material-ui/Grid/Grid";
import Paper from "material-ui/Paper/Paper";
import { FormControlLabel } from "material-ui/Form";
import Checkbox from "material-ui/Checkbox";
import Typography from "material-ui/Typography";
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import AddCircleIcon from 'material-ui-icons/AddCircle';
import RemoveCircleIcon from 'material-ui-icons/RemoveCircle';
import { orange, red, green, grey } from 'material-ui/colors';
import * as Consts from '../consts';
import { Matches } from '../classes/HazMat';


class Root extends Component {
  state = {
    matchDataSource: {},
    teamDbPointer: {},
  };

  tdb = {};

  componentWillMount(props = this.props) {
    let tbd = this.tbd = db.collection('teams')
      .doc(props.match.params.team)
      .collection('matches')
      .doc(props.match.params.match);

    this.updateTitle(props);
  }

  updateTitle(props = this.props) {
    Consts.APP_NAME = `Scouting Team ${props.match.params.team} - ${props.match.params.color.replace(/(^|\s)\S/g, l => l.toUpperCase())} - Match ${props.match.params.match}`;    
  }

  componentWillReceiveProps(props) {
    this.props = props;
    this.componentWillMount(props);
    this.componentDidMount();
    this.updateTitle(props);
    window.scrollTo(0, 0);    
  }

  componentDidMount() {
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
        });
      } else {
        data = initalData.data();
      }

      this.setState({
        matchDataSource: data,
        teamDbPointer: this.tbd,
      });
      this.listenOnTeamPointer();
    });
  }

  listenOnTeamPointer() {
    this.state.teamDbPointer.onSnapshot((data) => {
      console.log(data.data(), 'Обновление указателя команды');
      this.setState({
        matchDataSource: data.data(),
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
    this.state.teamDbPointer.update({
      [name]: value,
    });
  }

  getMatchItemState(name) {
    return this.state.matchDataSource[name];
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid container>
        <Grid item xs={12}>
          <Paper
            className={classNames(
              classes.scoreElementContainer
            )}
          >
            <Typography type="headline" gutterBottom>
              Auto
            </Typography>
            <Grid container>
              <Grid item xs>
                <div className={
                  classNames(classes.textCenter)
                }>
                  <Typography type="body1">
                    Crossed Auto Line
                  </Typography>
                  <Checkbox
                    checked={!!this.getMatchItemState('autoCross')}
                    onChange={() => this.toggleCheck('autoCross')}
                    value="autoCross"
                    name="autoCross"
                  />
                </div>
              </Grid>
              <Grid item xs>
                <div className={
                  classNames(classes.textCenter)
                }>
                  <Typography type="body1">
                    Picked Up Cube
                  </Typography>
                  <Checkbox
                    checked={!!this.getMatchItemState('autoCubePickup')}
                    onChange={() => this.toggleCheck('autoCubePickup')}
                    value="autoCubePickup"
                    name="autoCubePickup"
                  />
                  <div className={classNames({
                    [classes.noDisplay]: !!!this.getMatchItemState('autoCubePickup') || false
                  })}>
                    <FormControl>
                      <InputLabel htmlFor="pickup-location">Location</InputLabel>
                      <Select
                        value={this.getMatchItemState('autoCubePickupLocation') || 'pile'}
                        onChange={(e) => this.updateValue('autoCubePickupLocation', e.target.value)}
                        input={<Input name="location" id="pickup-location" />}
                      >
                        <MenuItem value="human">Human Player</MenuItem>
                        <MenuItem value="pile">Cube Pile</MenuItem>
                        <MenuItem value="switch">Cubes Along Switch</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </Grid>
              <Grid item xs>
                <div className={
                  classNames(classes.textCenter)
                }>
                  <Typography type="body1">
                    Placed Cube on Switch
                  </Typography>
                  <div className={classNames({
                    [classes.noDisplay]: (!!this.getMatchItemState('autoSwitchCube') || false) && (this.getMatchItemState('autoSwitchCubeCount') > 0)
                  })}>
                    <Checkbox
                      checked={!!this.getMatchItemState('autoSwitchCube')}
                      onChange={() => {
                        if (!!!this.getMatchItemState('autoSwitchCube') === true) {
                          this.updateValue('autoSwitchCubeCount', this.getMatchItemState('autoSwitchCubeCount') + 1)
                        } else {
                          this.updateValue('autoSwitchCubeCount', 0)
                        }

                        this.toggleCheck('autoSwitchCube')                        
                      }}
                      value="autoSwitchCube"
                      name="autoSwitchCube"
                    />
                  </div>
                  <div className={classNames({
                    [classes.noDisplay]: (!!!this.getMatchItemState('autoSwitchCube') || false) || (this.getMatchItemState('autoSwitchCubeCount') <= 0)
                  })}>
                    <FormControl>
                      <IconButton
                        style={{
                          color: green[500]
                        }}
                        onClick={() => {
                          this.updateValue(
                            'autoSwitchCubeCount',
                            this.getMatchItemState('autoSwitchCubeCount') + 1
                          )
                        }}
                      >
                        <AddCircleIcon/>
                      </IconButton>
                      <Typography >
                        {this.getMatchItemState('autoSwitchCubeCount')}
                      </Typography>
                      <IconButton
                        style={{
                          color: red[500]
                        }}
                        onClick={() => {
                          if ((this.getMatchItemState('autoSwitchCubeCount') - 1) === 0) {
                            this.toggleCheck('autoSwitchCube');
                          }

                          this.updateValue(
                            'autoSwitchCubeCount',
                            this.getMatchItemState('autoSwitchCubeCount') - 1
                          )
                        }}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    </FormControl>
                  </div>
                </div>
              </Grid>
              <Grid item xs>
                <div className={
                  classNames(classes.textCenter)
                }>
                  <Typography type="body1">
                    Placed Cube on Scale
                  </Typography>
                  <div className={classNames({
                    [classes.noDisplay]: (!!this.getMatchItemState('autoScaleCube') || false) && (this.getMatchItemState('autoScaleCubeCount') > 0)
                  })}>
                    <Checkbox
                      checked={!!this.getMatchItemState('autoScaleCube')}
                      onChange={() => {
                        if (!!!this.getMatchItemState('autoScaleCube') === true) {
                          this.updateValue('autoScaleCubeCount', this.getMatchItemState('autoScaleCubeCount') + 1)
                        } else {
                          this.updateValue('autoScaleCubeCount', 0)
                        }

                        this.toggleCheck('autoScaleCube')                        
                      }}
                      value="autoScaleCube"
                      name="autoScaleCube"
                    />
                  </div>
                  <div className={classNames({
                    [classes.noDisplay]: (!!!this.getMatchItemState('autoScaleCube') || false) || (this.getMatchItemState('autoScaleCubeCount') <= 0)
                  })}>
                    <FormControl>
                      <IconButton
                        style={{
                          color: green[500]
                        }}
                        onClick={() => {
                          this.updateValue(
                            'autoScaleCubeCount',
                            this.getMatchItemState('autoScaleCubeCount') + 1
                          )
                        }}
                      >
                        <AddCircleIcon/>
                      </IconButton>
                      <Typography >
                        {this.getMatchItemState('autoScaleCubeCount')}
                      </Typography>
                      <IconButton
                        style={{
                          color: red[500]
                        }}
                        onClick={() => {
                          if ((this.getMatchItemState('autoScaleCubeCount') - 1) === 0) {
                            this.toggleCheck('autoScaleCube');
                          }

                          this.updateValue(
                            'autoScaleCubeCount',
                            this.getMatchItemState('autoScaleCubeCount') - 1
                          )
                        }}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    </FormControl>
                  </div>
                </div>
              </Grid>
              <Grid item xs>
                <div className={
                  classNames(classes.textCenter)
                }>
                  <Typography type="body1">
                    Placed Cube on Wrong Side
                  </Typography>
                  <div className={classNames({
                    [classes.noDisplay]: (!!this.getMatchItemState('autoCubeWrong') || false) && (this.getMatchItemState('autoCubeWrongCount') > 0)
                  })}>
                    <Checkbox
                      checked={!!this.getMatchItemState('autoCubeWrong')}
                      onChange={() => {
                        if (!!!this.getMatchItemState('autoCubeWrong') === true) {
                          this.updateValue('autoCubeWrongCount', this.getMatchItemState('autoCubeWrongCount') + 1)
                        } else {
                          this.updateValue('autoCubeWrongCount', 0)
                        }

                        this.toggleCheck('autoCubeWrong')
                      }}
                      value="autoCubeWrong"
                      name="autoCubeWrong"
                    />
                  </div>
                  <div className={classNames({
                    [classes.noDisplay]: (!!!this.getMatchItemState('autoCubeWrong') || false) || (this.getMatchItemState('autoCubeWrongCount') <= 0)
                  })}>
                    <FormControl>
                      <IconButton
                        style={{
                          color: orange[500]
                        }}
                        onClick={() => {
                          this.updateValue(
                            'autoCubeWrongCount',
                            this.getMatchItemState('autoCubeWrongCount') + 1
                          )
                        }}
                      >
                        <AddCircleIcon />
                      </IconButton>
                      <Typography >
                        {this.getMatchItemState('autoCubeWrongCount')}
                      </Typography>
                      <IconButton
                        style={{
                          color: red[500]
                        }}
                        onClick={() => {
                          if ((this.getMatchItemState('autoCubeWrongCount') - 1) === 0) {
                            this.toggleCheck('autoCubeWrong');
                          }

                          this.updateValue(
                            'autoCubeWrongCount',
                            this.getMatchItemState('autoCubeWrongCount') - 1
                          )
                        }}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    </FormControl>
                  </div>
                </div>
              </Grid>
              <Grid item xs>
                <div className={
                  classNames(classes.textCenter)
                }>
                  <Typography type="body1">
                    Starting Position
                  </Typography>
                  <FormControl>
                    <Select
                      value={this.getMatchItemState('startingPosition') || 'middle'}
                      onChange={(e) => this.updateValue('startingPosition', e.target.value)}
                      input={<Input name="location" />}
                    >
                      <MenuItem value="left">Field Left</MenuItem>
                      <MenuItem value="middle">Middle</MenuItem>
                      <MenuItem value="right">Field Right</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper
            className={classNames(
              classes.scoreElementContainer
            )}
          >
            <Typography type="headline" gutterBottom>
              Teleop
            </Typography>
            <Grid container>
              <Grid item xs>
                <div className={
                  classNames(classes.textCenter)
                }>
                  <Typography type="body1">
                    Placed Cube on Alliance Switch
                  </Typography>
                  <div className={classNames({
                    [classes.noDisplay]: (!!this.getMatchItemState('teleopAllianceSwitchCube') || false) && (this.getMatchItemState('teleopAllianceSwitchCubeCount') > 0)
                  })}>
                    <Checkbox
                      checked={!!this.getMatchItemState('teleopAllianceSwitchCube')}
                      onChange={() => {
                        if (!!!this.getMatchItemState('teleopAllianceSwitchCube') === true) {
                          this.updateValue('teleopAllianceSwitchCubeCount', this.getMatchItemState('teleopAllianceSwitchCubeCount') + 1)
                        } else {
                          this.updateValue('teleopAllianceSwitchCubeCount', 0)
                        }

                        this.toggleCheck('teleopAllianceSwitchCube')
                      }}
                      value="teleopAllianceSwitchCube"
                      name="teleopAllianceSwitchCube"
                    />
                  </div>
                  <div className={classNames({
                    [classes.noDisplay]: (!!!this.getMatchItemState('teleopAllianceSwitchCube') || false) || (this.getMatchItemState('teleopAllianceSwitchCubeCount') <= 0)
                  })}>
                    <FormControl>
                      <IconButton
                        style={{
                          color: green[500]
                        }}
                        onClick={() => {
                          this.updateValue(
                            'teleopAllianceSwitchCubeCount',
                            this.getMatchItemState('teleopAllianceSwitchCubeCount') + 1
                          )
                        }}
                      >
                        <AddCircleIcon />
                      </IconButton>
                      <Typography >
                        {this.getMatchItemState('teleopAllianceSwitchCubeCount')}
                      </Typography>
                      <IconButton
                        style={{
                          color: red[500]
                        }}
                        onClick={() => {
                          if ((this.getMatchItemState('teleopAllianceSwitchCubeCount') - 1) === 0) {
                            this.toggleCheck('teleopAllianceSwitchCube');
                          }

                          this.updateValue(
                            'teleopAllianceSwitchCubeCount',
                            this.getMatchItemState('teleopAllianceSwitchCubeCount') - 1
                          )
                        }}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    </FormControl>
                  </div>
                </div>
              </Grid>
              <Grid item xs>
                <div className={
                  classNames(classes.textCenter)
                }>
                  <Typography type="body1">
                    Placed Cube on Opponent Switch
                  </Typography>
                  <div className={classNames({
                    [classes.noDisplay]: (!!this.getMatchItemState('teleopOpponentSwitchCube') || false) && (this.getMatchItemState('teleopOpponentSwitchCubeCount') > 0)
                  })}>
                    <Checkbox
                      checked={!!this.getMatchItemState('teleopOpponentSwitchCube')}
                      onChange={() => {
                        if (!!!this.getMatchItemState('teleopOpponentSwitchCube') === true) {
                          this.updateValue('teleopOpponentSwitchCubeCount', this.getMatchItemState('teleopOpponentSwitchCubeCount') + 1)
                        } else {
                          this.updateValue('teleopOpponentSwitchCubeCount', 0)
                        }

                        this.toggleCheck('teleopOpponentSwitchCube')
                      }}
                      value="teleopOpponentSwitchCube"
                      name="teleopOpponentSwitchCube"
                    />
                  </div>
                  <div className={classNames({
                    [classes.noDisplay]: (!!!this.getMatchItemState('teleopOpponentSwitchCube') || false) || (this.getMatchItemState('teleopOpponentSwitchCubeCount') <= 0)
                  })}>
                    <FormControl>
                      <IconButton
                        style={{
                          color: green[500]
                        }}
                        onClick={() => {
                          this.updateValue(
                            'teleopOpponentSwitchCubeCount',
                            this.getMatchItemState('teleopOpponentSwitchCubeCount') + 1
                          )
                        }}
                      >
                        <AddCircleIcon />
                      </IconButton>
                      <Typography >
                        {this.getMatchItemState('teleopOpponentSwitchCubeCount')}
                      </Typography>
                      <IconButton
                        style={{
                          color: red[500]
                        }}
                        onClick={() => {
                          if ((this.getMatchItemState('teleopOpponentSwitchCubeCount') - 1) === 0) {
                            this.toggleCheck('teleopOpponentSwitchCube');
                          }

                          this.updateValue(
                            'teleopOpponentSwitchCubeCount',
                            this.getMatchItemState('teleopOpponentSwitchCubeCount') - 1
                          )
                        }}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    </FormControl>
                  </div>
                </div>
              </Grid>
              <Grid item xs>
                <div className={
                  classNames(classes.textCenter)
                }>
                  <Typography type="body1">
                    Placed Cube on Scale
                  </Typography>
                  <div className={classNames({
                    [classes.noDisplay]: (!!this.getMatchItemState('teleopScaleCube') || false) && (this.getMatchItemState('teleopScaleCubeCount') > 0)
                  })}>
                    <Checkbox
                      checked={!!this.getMatchItemState('teleopScaleCube')}
                      onChange={() => {
                        if (!!!this.getMatchItemState('teleopScaleCube') === true) {
                          this.updateValue('teleopScaleCubeCount', this.getMatchItemState('teleopScaleCubeCount') + 1)
                        } else {
                          this.updateValue('teleopScaleCubeCount', 0)
                        }

                        this.toggleCheck('teleopScaleCube')
                      }}
                      value="teleopScaleCube"
                      name="teleopScaleCube"
                    />
                  </div>
                  <div className={classNames({
                    [classes.noDisplay]: (!!!this.getMatchItemState('teleopScaleCube') || false) || (this.getMatchItemState('teleopScaleCubeCount') <= 0)
                  })}>
                    <FormControl>
                      <IconButton
                        style={{
                          color: green[500]
                        }}
                        onClick={() => {
                          this.updateValue(
                            'teleopScaleCubeCount',
                            this.getMatchItemState('teleopScaleCubeCount') + 1
                          )
                        }}
                      >
                        <AddCircleIcon />
                      </IconButton>
                      <Typography >
                        {this.getMatchItemState('teleopScaleCubeCount')}
                      </Typography>
                      <IconButton
                        style={{
                          color: red[500]
                        }}
                        onClick={() => {
                          if ((this.getMatchItemState('teleopScaleCubeCount') - 1) === 0) {
                            this.toggleCheck('teleopScaleCube');
                          }

                          this.updateValue(
                            'teleopScaleCubeCount',
                            this.getMatchItemState('teleopScaleCubeCount') - 1
                          )
                        }}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    </FormControl>
                  </div>
                </div>
              </Grid>
              <Grid item xs>
                <div className={
                  classNames(classes.textCenter)
                }>
                  <Typography type="body1">
                    Put Cube through Exchange
                  </Typography>
                  <div className={classNames({
                    [classes.noDisplay]: (!!this.getMatchItemState('teleopExchangeCube') || false) && (this.getMatchItemState('teleopExchangeCubeCount') > 0)
                  })}>
                    <Checkbox
                      checked={!!this.getMatchItemState('teleopExchangeCube')}
                      onChange={() => {
                        if (!!!this.getMatchItemState('teleopExchangeCube') === true) {
                          this.updateValue('teleopExchangeCubeCount', this.getMatchItemState('teleopExchangeCubeCount') + 1)
                        } else {
                          this.updateValue('teleopExchangeCubeCount', 0)
                        }

                        this.toggleCheck('teleopExchangeCube')
                      }}
                      value="teleopExchangeCube"
                      name="teleopExchangeCube"
                    />
                  </div>
                  <div className={classNames({
                    [classes.noDisplay]: (!!!this.getMatchItemState('teleopExchangeCube') || false) || (this.getMatchItemState('teleopExchangeCubeCount') <= 0)
                  })}>
                    <FormControl>
                      <IconButton
                        style={{
                          color: green[500]
                        }}
                        onClick={() => {
                          this.updateValue(
                            'teleopExchangeCubeCount',
                            this.getMatchItemState('teleopExchangeCubeCount') + 1
                          )
                        }}
                      >
                        <AddCircleIcon />
                      </IconButton>
                      <Typography >
                        {this.getMatchItemState('teleopExchangeCubeCount')}
                      </Typography>
                      <IconButton
                        style={{
                          color: red[500]
                        }}
                        onClick={() => {
                          if ((this.getMatchItemState('teleopExchangeCubeCount') - 1) === 0) {
                            this.toggleCheck('teleopExchangeCube');
                          }

                          this.updateValue(
                            'teleopExchangeCubeCount',
                            this.getMatchItemState('teleopExchangeCubeCount') - 1
                          )
                        }}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    </FormControl>
                  </div>
                </div>
              </Grid>
              <Grid item xs>
                <div className={
                  classNames(classes.textCenter)
                }>
                  <Typography type="body1">
                    Played Defense
                  </Typography>
                  <Checkbox
                    checked={!!this.getMatchItemState('teleopDefense')}
                    onChange={() => this.toggleCheck('teleopDefense')}
                    value="teleopDefense"
                    name="teleopDefense"
                  />
                </div>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs>
                <div className={
                  classNames(classes.textCenter)
                }>
                  <Typography type="body1">
                    Cube on Wrong Side - Alliance Switch 
                  </Typography>
                  <div className={classNames({
                    [classes.noDisplay]: (!!this.getMatchItemState('teleopAllianceSwitchCubeWrong') || false) && (this.getMatchItemState('teleopAllianceSwitchCubeWrongCount') > 0)
                  })}>
                    <Checkbox
                      checked={!!this.getMatchItemState('teleopAllianceSwitchCubeWrong')}
                      onChange={() => {
                        if (!!!this.getMatchItemState('teleopAllianceSwitchCubeWrong') === true) {
                          this.updateValue('teleopAllianceSwitchCubeWrongCount', this.getMatchItemState('teleopAllianceSwitchCubeWrongCount') + 1)
                        } else {
                          this.updateValue('teleopAllianceSwitchCubeWrongCount', 0)
                        }

                        this.toggleCheck('teleopAllianceSwitchCubeWrong')
                      }}
                      value="teleopAllianceSwitchCubeWrong"
                      name="teleopAllianceSwitchCubeWrong"
                    />
                  </div>
                  <div className={classNames({
                    [classes.noDisplay]: (!!!this.getMatchItemState('teleopAllianceSwitchCubeWrong') || false) || (this.getMatchItemState('teleopAllianceSwitchCubeWrongCount') <= 0)
                  })}>
                    <FormControl>
                      <IconButton
                        style={{
                          color: orange[500]
                        }}
                        onClick={() => {
                          this.updateValue(
                            'teleopAllianceSwitchCubeWrongCount',
                            this.getMatchItemState('teleopAllianceSwitchCubeWrongCount') + 1
                          )
                        }}
                      >
                        <AddCircleIcon />
                      </IconButton>
                      <Typography>
                        {this.getMatchItemState('teleopAllianceSwitchCubeWrongCount')}
                      </Typography>
                      <IconButton
                        style={{
                          color: red[500]
                        }}
                        onClick={() => {
                          if ((this.getMatchItemState('teleopAllianceSwitchCubeWrongCount') - 1) === 0) {
                            this.toggleCheck('teleopAllianceSwitchCubeWrong');
                          }

                          this.updateValue(
                            'teleopAllianceSwitchCubeWrongCount',
                            this.getMatchItemState('teleopAllianceSwitchCubeWrongCount') - 1
                          );
                        }}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    </FormControl>
                  </div>
                </div>
              </Grid>
              <Grid item xs>
                <div className={
                  classNames(classes.textCenter)
                }>
                  <Typography type="body1">
                    Cube on Wrong Side - Opponent Switch
                  </Typography>
                  <div className={classNames({
                    [classes.noDisplay]: (!!this.getMatchItemState('teleopOpponentSwitchCubeWrong') || false) && (this.getMatchItemState('teleopOpponentSwitchCubeWrongCount') > 0)
                  })}>
                    <Checkbox
                      checked={!!this.getMatchItemState('teleopOpponentSwitchCubeWrong')}
                      onChange={() => {
                        if (!!!this.getMatchItemState('teleopOpponentSwitchCubeWrong') === true) {
                          this.updateValue('teleopOpponentSwitchCubeWrongCount', this.getMatchItemState('teleopOpponentSwitchCubeWrongCount') + 1)
                        } else {
                          this.updateValue('teleopOpponentSwitchCubeWrongCount', 0)
                        }

                        this.toggleCheck('teleopOpponentSwitchCubeWrong')
                      }}
                      value="teleopOpponentSwitchCubeWrong"
                      name="teleopOpponentSwitchCubeWrong"
                    />
                  </div>
                  <div className={classNames({
                    [classes.noDisplay]: (!!!this.getMatchItemState('teleopOpponentSwitchCubeWrong') || false) || (this.getMatchItemState('teleopOpponentSwitchCubeWrongCount') <= 0)
                  })}>
                    <FormControl>
                      <IconButton
                        style={{
                          color: orange[500]
                        }}
                        onClick={() => {
                          this.updateValue(
                            'teleopOpponentSwitchCubeWrongCount',
                            this.getMatchItemState('teleopOpponentSwitchCubeWrongCount') + 1
                          )
                        }}
                      >
                        <AddCircleIcon />
                      </IconButton>
                      <Typography>
                        {this.getMatchItemState('teleopOpponentSwitchCubeWrongCount')}
                      </Typography>
                      <IconButton
                        style={{
                          color: red[500]
                        }}
                        onClick={() => {
                          if ((this.getMatchItemState('teleopOpponentSwitchCubeWrongCount') - 1) === 0) {
                            this.toggleCheck('teleopOpponentSwitchCubeWrong');
                          }

                          this.updateValue(
                            'teleopOpponentSwitchCubeWrongCount',
                            this.getMatchItemState('teleopOpponentSwitchCubeWrongCount') - 1
                          );
                        }}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    </FormControl>
                  </div>
                </div>
              </Grid>
              <Grid item xs>
                <div className={
                  classNames(classes.textCenter)
                }>
                  <Typography type="body1">
                    Cube on Wrong Side - Scale
                  </Typography>
                  <div className={classNames({
                    [classes.noDisplay]: (!!this.getMatchItemState('teleopScaleCubeWrong') || false) && (this.getMatchItemState('teleopScaleCubeWrongCount') > 0)
                  })}>
                    <Checkbox
                      checked={!!this.getMatchItemState('teleopScaleCubeWrong')}
                      onChange={() => {
                        if (!!!this.getMatchItemState('teleopScaleCubeWrong') === true) {
                          this.updateValue('teleopScaleCubeWrongCount', this.getMatchItemState('teleopScaleCubeWrongCount') + 1)
                        } else {
                          this.updateValue('teleopScaleCubeWrongCount', 0)
                        }

                        this.toggleCheck('teleopScaleCubeWrong')
                      }}
                      value="teleopScaleCubeWrong"
                      name="teleopScaleCubeWrong"
                    />
                  </div>
                  <div className={classNames({
                    [classes.noDisplay]: (!!!this.getMatchItemState('teleopScaleCubeWrong') || false) || (this.getMatchItemState('teleopScaleCubeWrongCount') <= 0)
                  })}>
                    <FormControl>
                      <IconButton
                        style={{
                          color: orange[500]
                        }}
                        onClick={() => {
                          this.updateValue(
                            'teleopScaleCubeWrongCount',
                            this.getMatchItemState('teleopScaleCubeWrongCount') + 1
                          )
                        }}
                      >
                        <AddCircleIcon />
                      </IconButton>
                      <Typography>
                        {this.getMatchItemState('teleopScaleCubeWrongCount')}
                      </Typography>
                      <IconButton
                        style={{
                          color: red[500]
                        }}
                        onClick={() => {
                          if ((this.getMatchItemState('teleopScaleCubeWrongCount') - 1) === 0) {
                            this.toggleCheck('teleopScaleCubeWrong');
                          }
                          
                          this.updateValue(
                            'teleopScaleCubeWrongCount',
                            this.getMatchItemState('teleopScaleCubeWrongCount') - 1
                          )
                        }}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    </FormControl>
                  </div>
                </div>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs>
                <div className={
                  classNames(classes.textCenter)
                }>
                  <Typography type="body1">
                    Boost Powerup
                  </Typography>
                  <div>
                    <FormControl>
                      <IconButton
                        style={{
                          color: (
                            (!!this.getMatchItemState('powerupBoost') === true) ||
                            (this.getMatchItemState('powerupBoostCount') === 3)
                          ) ? grey[500] : green[500],
                        }}
                        onClick={() => {
                          this.updateValue(
                            'powerupBoostCount',
                            this.getMatchItemState('powerupBoostCount') + 1
                          )
                        }}
                        disabled={
                          (!!this.getMatchItemState('powerupBoost')) || 
                          (this.getMatchItemState('powerupBoostCount') === 3)
                        }
                      >
                        <AddCircleIcon />
                      </IconButton>
                      <Typography>
                        {this.getMatchItemState('powerupBoostCount')}
                      </Typography>
                      <IconButton
                        style={{
                          color: red[500]
                        }}
                        onClick={() => {
                          if (this.getMatchItemState('powerupBoostCount') <= 0) {
                            return;
                          }

                          this.updateValue(
                            'powerupBoostCount',
                            this.getMatchItemState('powerupBoostCount') - 1
                          )
                        }}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    </FormControl>
                  </div>
                  <div>
                    <Checkbox
                      checked={!!this.getMatchItemState('powerupBoost')}
                      onChange={() => this.toggleCheck('powerupBoost')}
                      value="powerupBoost"
                      name="powerupBoost"
                    />
                    <Typography style={{
                      marginTop: '-.75rem'
                    }}>
                      Activated
                    </Typography>
                  </div>
                </div>
              </Grid>
              <Grid item xs>
                <div className={
                  classNames(classes.textCenter)
                }>
                  <Typography type="body1">
                    Force Powerup
                  </Typography>
                  <div>
                    <FormControl>
                      <IconButton
                        style={{
                          color: (
                            (!!this.getMatchItemState('powerupForce') === true) ||
                            (this.getMatchItemState('powerupForceCount') === 3)
                          ) ? grey[500] : green[500],
                        }}
                        onClick={() => {
                          this.updateValue(
                            'powerupForceCount',
                            this.getMatchItemState('powerupForceCount') + 1
                          )
                        }}
                        disabled={
                          (!!this.getMatchItemState('powerupForce')) ||
                          (this.getMatchItemState('powerupForceCount') === 3)
                        }
                      >
                        <AddCircleIcon />
                      </IconButton>
                      <Typography>
                        {this.getMatchItemState('powerupForceCount')}
                      </Typography>
                      <IconButton
                        style={{
                          color: red[500]
                        }}
                        onClick={() => {
                          if (this.getMatchItemState('powerupForceCount') <= 0) {
                            return;
                          }

                          this.updateValue(
                            'powerupForceCount',
                            this.getMatchItemState('powerupForceCount') - 1
                          )
                        }}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    </FormControl>
                  </div>
                  <div>
                    <Checkbox
                      checked={!!this.getMatchItemState('powerupForce')}
                      onChange={() => this.toggleCheck('powerupForce')}
                      value="powerupForce"
                      name="powerupForce"
                    />
                    <Typography style={{
                      marginTop: '-.75rem'
                    }}>
                      Activated
                    </Typography>
                  </div>
                </div>
              </Grid>
              <Grid item xs>
                <div className={
                  classNames(classes.textCenter)
                }>
                  <Typography type="body1">
                    Levitate Powerup
                  </Typography>
                  <Checkbox
                    checked={!!this.getMatchItemState('powerupLevitate')}
                    onChange={() => this.toggleCheck('powerupLevitate')}
                    value="powerupLevitate"
                    name="powerupLevitate"
                  />
                  <Typography style={{
                    marginTop: '-.75rem'
                  }}>
                    Activated
                  </Typography>
                </div>
              </Grid>
              <Grid item xs>
                <div className={
                  classNames(classes.textCenter)
                }>
                  <Typography type="body1">
                    Climb Status
                  </Typography>
                  <FormControl>
                    <Select
                      value={this.getMatchItemState('endgameClimbStatus') || Consts.GAME.end.climb.NOT_PARKED}
                      onChange={(e) => this.updateValue('endgameClimbStatus', e.target.value)}
                      input={<Input name="climbStatus" />}
                    >
                      <MenuItem value={Consts.GAME.end.climb.NOT_PARKED}>Not Parked</MenuItem>
                      <MenuItem value={Consts.GAME.end.climb.PARKED}>Parked</MenuItem>
                      <MenuItem value={Consts.GAME.end.climb.ATTEMPTED_CLIMB}>Attempted Climb</MenuItem>
                      <MenuItem value={Consts.GAME.end.climb.ATTEMPTED_ATTACH}>Attempted to Attach to another Robot</MenuItem>
                      <MenuItem value={Consts.GAME.end.climb.ATTEMPTED_CARRY}>Attempted to Carry another Robot</MenuItem>
                      <MenuItem value={Consts.GAME.end.climb.SUCCESS_CLIMB}>Successfully Climbed</MenuItem>
                      <MenuItem value={Consts.GAME.end.climb.SUCCESS_WITH_ROBOT}>Successfully Climbed with another Robot</MenuItem>
                      <MenuItem value={Consts.GAME.end.climb.SUCCESS_ON_ROBOT}>Successfully Climbed on another Robot</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Button
          raised
          onClick={() => {
            db.collection("matches").doc(
              (parseInt(this.props.match.params.match) + 1).toString()
            ).get().then(_ => {
              let d = _.data();
              // console.log(this.props.history);              
              this.props.history.replace(
                `/scout/${
                  this.props.match.params.color
                }/${
                  (parseInt(this.props.match.params.match) + 1).toString()
                }/${
                  d[this.props.match.params.color][this.props.match.params.position]
                }/${this.props.match.params.position}`
              );
              // console.log(this.props.history);              
            });
            // let nextMatch = null;/* (await Matches.get(this.props.match.params.match + 1)).data(); */

          }}
        >
          Next Team for Position
        </Button>
      </Grid>
    );
  }
}

export default withStyles(MainStyles)(Root);