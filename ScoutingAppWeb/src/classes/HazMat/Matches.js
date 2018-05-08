import { db } from '../../entry';

export default class Matches {
  static get(match) {
    return db.collection("matches").doc(match.toString()).get();
  }
}