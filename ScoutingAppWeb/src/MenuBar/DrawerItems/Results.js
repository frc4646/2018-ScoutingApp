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
            Consts.APP_NAME = 'Results';
            this.props.history.push(`/results`);
          }}
        >
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Results" />
        </ListItem>
      </div>
    );
  }
}

export const ResultList = <Root />;