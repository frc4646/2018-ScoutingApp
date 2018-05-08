import { db } from "../../entry";

export default class Teams {
  static get(team) {
    return db.collection("teams").doc(team.toString()).get();
  }
}
