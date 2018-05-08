// @flow
import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import BuildIcon from 'material-ui-icons/Build';

export const MiscList = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <BuildIcon />
      </ListItemIcon>
      <ListItemText primary="Settings" />
    </ListItem>
  </div>
);