// @flow
import React, { Component } from 'react';
import Search from 'material-ui-icons/Search';
import { withStyles } from 'material-ui/styles';
import { SearchStyles } from './../styles';

class AppSearch extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.wrapper}>
        <div className={classes.search}>
          <Search />
        </div>
        <input id="docsearch-input" className={classes.input} />
      </div>
    );
  }
}

export default withStyles(SearchStyles)(AppSearch);