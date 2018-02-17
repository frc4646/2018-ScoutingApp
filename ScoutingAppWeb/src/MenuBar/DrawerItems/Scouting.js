// @flow
import React, { Component } from 'react';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import AssignmentIcon from 'material-ui-icons/Assignment';
import { withRouter } from 'react-router';
import * as Consts from './../../consts';

@withRouter
class Root extends Component {
  render() {
    return (
      <div>
        <ListItem
          button
          onClick={() => {
            Consts.APP_NAME = 'Scouting App';
            this.props.history.push(`/`)
          }}
        >
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Match Scouting" />
        </ListItem>
      </div>
    );
  }
}

export const ScoutingList = <Root />;