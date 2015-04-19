"use strict";
import React from "react";

import PointsLog from "../components/points-log";
import ApplyToEvent from "../components/apply-to-event";

import request from "../middlewares/request";

const IndexPage = React.createClass({
  displayName: "IndexPage",
  getInitialState() {
    return {
      user: {}
    };
  },

  componentDidMount() {
    request.get("/users/me", (err, res) => {
      if (err || res.status !== 200) return;
      let user = res.body.user;
      if (user.promocard && user.promocard.date) {
        user.promocard.date = new Date(user.promocard.date);
      }
      this.setState({ user: user });
    });
  },

  render() {
    return (
      <div className="index-page">
        <ApplyToEvent promocard={this.state.user.promocard} />
        <PointsLog log={this.state.user.points} />
      </div>
    );
  }
});

function parseEvent (event) {
  return {
    id: event.id,
    name: event.name,
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate),
    tasks: event.tasks,
  };
}

export default IndexPage;
