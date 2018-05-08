import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

const MenuBar = _ => (
  <div className={_.classes.root}>
    <AppBar position="static">
      <Toolbar>
        <IconButton
          color="contrast"
          aria-label="Menu"
          onClick={() => alert("Clicked")}
        >
          <MenuIcon />
        </IconButton>
        <Typography type="title" color="inherit" className={_.classes.flex}>
          Title
        </Typography>
        <Button color="contrast">Login</Button>
      </Toolbar>
    </AppBar>
  </div>
);

const styles = {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
};

const Root = withStyles(styles)(MenuBar);

export default Root;