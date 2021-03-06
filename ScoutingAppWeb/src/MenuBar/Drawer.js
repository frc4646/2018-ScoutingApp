// @flow
import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List from 'material-ui/List';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import Button from 'material-ui/Button';
import * as Consts from './../consts';
import { DrawerStyles as styles } from './../styles';
import { ScoutingList } from './DrawerItems/Scouting';
import { MiscList } from './DrawerItems/Misc';
import { ResultList } from './DrawerItems/Results';
import {default as AppSearch} from './Search';
import Search from 'material-ui-icons/Search';
import { default as Linker } from './../pages/linker';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import * as firebase from 'firebase';
import { db } from '../entry';
import WatchJS from 'melanke-watchjs';

class Root extends Component {
  state = {
    drawerOpen: false,
    loginOpen: false,
    username: '',
    password: '',
    loggingIn: false,
    error: false,
    errorText: {},
    currentUser: false,
    loggingOut: false,
    messageOpen: false,
    messageText: '',
  };

  openDrawer = () => {
    this.setState({
      drawerOpen: true,
    })
  };

  closeDrawer = () => {
    this.setState({
      drawerOpen: false,
    })
  };

  openLogin = () => {
    if (firebase.auth().currentUser !== null) {
      this.setState({
        loggingOut: true,
      });

      firebase.auth().signOut().then(_ => {
        setTimeout(() => {
          this.setState({
            loggingOut: false,
            messageOpen: true,
            messageText: 'User logged out successfully!'
          });
        }, 2000)
      })
    } else {
      this.setState({
        loginOpen: true,
      });
    }
  };

  closeLogin = () => {
    this.setState({
      loginOpen: false,
    });
  }

  login = () => {
    this.setState({
      loggingIn: true,
    })
    firebase.auth().signInWithEmailAndPassword(
      this.state.username, this.state.password
    ).catch(error => {
      console.log(error);
      if (error.name.indexOf('user') || error.name.indexOf('email')) {
        this.setState({
          error: true,
          password: '',
          errorText: error,
          loggingIn: false
        });
      }
    }).then(_ => {
      this.setState({
        loginOpen: false,
        username: '',
        password: '',
        loggingIn: false,
        error: false,
        errorText: {},
        currentUser: true,
        messageOpen: true,
        messageText: 'User logged in successfully!'
      });
    });
  }

  componentWillMount = () => {
    setTimeout(() => {
      this.setState({
        currentUser: true,
      });
    }, 1000)
  }

  importFromTba() {
    let a = db.collection('matches');
    let teams = db.collection('teams');

    fetch("https://www.thebluealliance.com/api/v3/event/2018iacf/matches", {
      headers: {
        'X-TBA-Auth-Key': 'AfIrw52yJP2lcGkO4D3B0gABfvaAmqE6HJGxB3vSxUmNLQmgqDAZV6pKDm8wsg1S'
      }
    }).then(_ => _.json()).then(data => {
      _.filter(data, a => a.comp_level == "qm").forEach(obj => {
        a.doc(`${obj.match_number}`).set({
          number: obj.match_number,
          red: (() => {
            let z = [];

            _.map(obj.alliances.red.team_keys, k => {
              z.push(_.trimStart(k, 'frc'));
            });

            return z;
          })(),
          blue: (() => {
              let z = [];

              _.map(obj.alliances.blue.team_keys, k => {
                z.push(_.trimStart(k, 'frc'));
              });

              return z;
            })()
          })
      });
    });

    fetch("https://www.thebluealliance.com/api/v3/event/2018iacf/teams", {
      headers: {
        'X-TBA-Auth-Key': '<id>'
      }
    }).then(_ => _.json()).then(data => {
      console.log(data)
      data.forEach(obj => {
        teams.doc(`${obj.team_number}`).set({
          name: obj.name,
          nickname: obj.nickname,
          rookieyear: obj.rookie_year,
          number: obj.team_number
        });
      });
    })
  }

  render() {
    const { classes } = this.props;

    WatchJS.watch(Consts, 'APP_NAME', () => {
      this.closeDrawer();
      this.forceUpdate();
    });

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar className={classNames(classes.appBar, this.state.drawerOpen && classes.appBarShift)}>
            <Toolbar className={classes.loginPushRight} disableGutters={!this.state.drawerOpen}>
              <IconButton
                color="contrast"
                aria-label="Open Drawer"
                onClick={this.openDrawer}
                className={classNames(classes.menuButton, this.state.drawerOpen && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Typography type="title" color="inherit" noWrap className={classes.flex}>
                {Consts.APP_NAME}
              </Typography>
              <Button
                onClick={this.openLogin}
                disabled={this.state.loggingOut}
                color="contrast"
              >
                {firebase.auth().currentUser !== null ? 'Logout' : 'Login'}
              </Button>
              <IconButton
                onClick={() => {
                  this.setState({
                    messageOpen: true,
                    messageText: "Importing from TheBlueAlliance. Please Wait."
                  });
                  this.importFromTba()
                }}
                color="contrast"
              >
                <ChevronLeftIcon />
              </IconButton>
              <Dialog
                open={this.state.loginOpen}
                onRequestClose={this.closeLogin}
              >
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                  <form onSubmit={this.login} action="" type="post">
                    <TextField
                      id="username"
                      label="Username"
                      placeholder="anon@team4646.local"
                      margin="normal"
                      value={this.state.username}
                      onChange={event => this.setState({ username: event.target.value })}
                      disabled={this.state.loggingIn}
                      error={this.state.error}
                      helperText={this.state.errorText.message || ''}
                      helperTextClassName={classNames(classes.wrapErrorText)}
                    />
                    <br />
                    <TextField
                      id="password"
                      label="Password"
                      type="password"
                      margin="normal"
                      value={this.state.password}
                      onChange={event => this.setState({ password: event.target.value })}
                      disabled={this.state.loggingIn}
                    />
                    <DialogActions>
                      <Button onClick={this.login} color="primary" type="submit">
                        Login
                      </Button>
                    </DialogActions>
                  </form>
                </DialogContent>
              </Dialog>
              <Snackbar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                open={this.state.messageOpen}
                autoHideDuration={4e3}
                onClose={() => this.setState({messageOpen: false})}
                //onRequestClose={(_, reason) => reason === 'clickaway' ? null : this.setState({messageOpen: false})}
                SnackbarContentProps={{
                  'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{this.state.messageText}</span>}
              />
            </Toolbar>
          </AppBar>
          <Drawer
            type="persistent"
            classes={{
              paper: classes.drawerPaper,
            }}
            open={this.state.drawerOpen}
          >
            <div className={classes.drawerInner}>
              <div className={classes.drawerHeader}>
                <AppSearch />
                <IconButton onClick={this.closeDrawer}>
                  <ChevronLeftIcon />
                </IconButton>
              </div>
              <Divider />
              <List className={classes.list}>{ScoutingList}</List>
              {/* <Divider />
              <List className={classes.list}>{MiscList}</List> */}
              <Divider />
              <List className={classes.list}>{ResultList}</List>
            </div>
          </Drawer>
          <main className={classNames(classes.content, this.state.drawerOpen && classes.contentShift)}>
            <Linker />
          </main>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Root);