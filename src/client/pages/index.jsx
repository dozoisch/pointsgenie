/** @jsx React.DOM */
"use strict";
var React = require("react");
var PointsLog = require("../components/points-log");
var ApplyToEvent = require("../components/apply-to-event");

var request = require("../middlewares/request");

module.exports = React.createClass({
  displayName: "IndexPage",
  getInitialState: function() {
    return {
      user: {}
    };
  },
  componentDidMount: function() {
    request.get("/users/me", function (err, res) {
      if (err || res.status !== 200) return;
      var user = res.body.user;
      if (user.promocard && user.promocard.date) {
        user.promocard.date = new Date(user.promocard.date);
      }
      this.setState({ user: user });
    }.bind(this));
  },
  renderApplyToEvent: function () {

  },
  render: function() {
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
    wildcardTask: event.wildcardTask,
  };
}
