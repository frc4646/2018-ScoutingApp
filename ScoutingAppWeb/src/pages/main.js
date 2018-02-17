//@flow
import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { MainStyles } from './../styles';
import Typography from 'material-ui/Typography';
import Toolbar from 'material-ui/Toolbar';
import classNames from 'classnames';
import Paper from 'material-ui/Paper';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'material-ui/Table';
import { db } from '../entry';
import { Teams, Matches } from '../classes/HazMat';
import { Team, Match } from '../classes/MatHaz';
import IconButton from 'material-ui/IconButton';
import SettingsIcon from 'material-ui-icons/Settings';
import * as Consts from '../consts';
//import FilterListIcon from 'material-ui-icons/FilterList';
//import Collapse from 'material-ui/transitions/Collapse';
//import Radio, { RadioGroup } from 'material-ui/Radio';
//import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';

class Root extends Component {
  state = {
    //show: 'all',
    //sortDialogOpen: false,
    dataSource: [],

  };

  componentDidMount() {
    this.listenForDataChanges();
  }

  listenForDataChanges = () => {
    const ref = db.collection("matches");

    ref.onSnapshot(snapshot => {
      let map = [];

      snapshot.forEach(doc => {
        map.push(doc.data());
      });

      this.setState({ dataSource: map });
    });
  }

  /* sortRows = () => {
    return null;
  } */

  render() {
    const { classes } = this.props;

    return (
      <Paper>
        <Toolbar
          className={classes.root}
        >
          <div className={classes.title}>
            <Typography type="subheading">Matches</Typography>
          </div>
          {/* <div className={classes.spacer} />
          <div className={classes.actions}>
            <IconButton aria-label="Filter list (Broken)" onClick={() => this.setState({
              sortDialogOpen: !this.state.sortDialogOpen
            })}>
              <FilterListIcon />
            </IconButton>
          </div> */}
        </Toolbar>
        {/* <Collapse in={this.state.sortDialogOpen} transitionDuration="auto" unmountOnExit>
          <Toolbar>
            <div className={classes.fullWidth}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Filter Matches (Broken) (Not Imp</FormLabel>
                <RadioGroup
                  aria-label="Filter"
                  name="filter"
                  className={classes.group}
                  value={this.state.show}
                  onChange={event => this.setState({
                    show: event.target.value
                  })}
                >
                  <FormControlLabel value="all" control={<Radio />} label="All" />
                  <FormControlLabel value="completed" control={<Radio />} label="Completed" />
                  <FormControlLabel value="upcoming" control={<Radio />} label="Upcoming" />
                </RadioGroup>
              </FormControl>
            </div>
          </Toolbar>
        </Collapse> */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                numeric={false}
                className={classNames(classes.rightPadFix, classes.textCenter)}
              >
                {'Match #'}
              </TableCell>
              <TableCell
                className={classNames(classes.rightPadFix, classes.textCenter)}
                colSpan={3}
                numeric
              >
                {'Red'}
                <span></span>
              </TableCell>
              <TableCell
                className={classNames(classes.rightPadFix, classes.textCenter)}
                colSpan={3}
                numeric
              >
                {'Blue'}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.dataSource.map(_ => {
              return (
                <TableRow key={_.number} hover>
                  <TableCell
                  className={classNames(classes.rightPadFix, classes.textCenter)}
                  >
                    {_.number}
                  </TableCell>
                  {_.red.map((redTeam, _index) => {
                    return (
                      <TableCell
                        key={Math.random()}
                        className={classNames(classes.redTeam, classes.textCenter, classes.rightPadFix)}
                        onClick={async () => {
                          let match = (await Matches.get(_.number)).data();
                          console.log(match, 'sudos');

                          Consts.APP_NAME = `Scouting Team ${redTeam} - Red - Match ${_.number}`;

                          this.props.history.push(`/scout/red/${_.number}/${redTeam}/${_index}`);
                        }}
                        numeric
                      >
                        {redTeam.toString()}
                      </TableCell>
                    );
                  })}
                  {_.blue.map((blueTeam, _index) => {
                    return (
                      <TableCell
                        key={Math.random()}
                        className={classNames(classes.rightPadFix, classes.blueTeam, classes.textCenter)}
                        onClick={async () => {
                          let match = (await Matches.get(_.number)).data();
                          console.log(match, 'sudo');

                          Consts.APP_NAME = `Scouting Team ${blueTeam} - Blue - Match ${_.number}`;

                          this.props.history.push(`/scout/blue/${_.number}/${blueTeam}/${_index}`);
                        }}
                        numeric
                      >
                        {blueTeam.toString()}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default withStyles(MainStyles)(Root);