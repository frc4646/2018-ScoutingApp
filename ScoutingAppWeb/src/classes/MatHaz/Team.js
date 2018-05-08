import { db } from './../../entry';

export default class Team {
  match = {};
  team = {};
  scores = {};

  constructor(team, match) {
    if (match) {
      this.match = match;
    }
    
    this.team = team;
  }

  
}