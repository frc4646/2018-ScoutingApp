//@flow
import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import { default as Main } from './main';
import { default as ScoutTeam } from './scoutTeam';
import { Results } from './results';
import { ResultsTeam } from './results';

export default () => (
  <div>
    <Route exact path='/' component={Main} />
    <Route path='/scout/:color/:match/:team/:position' component={ScoutTeam} />
    <Route exact path='/results' component={Results} />
    <Route path='/results/:team' component={ResultsTeam} />
    {/* <Route path='/scout/:match/:team/comments' component={ScoutTeam} /> */}
  </div>
);