/** @jsx React.DOM */
"use strict";
var React = require("react");
var PointsLog = require("../components/points-log");
var ApplyToEvent = require("../components/apply-to-event");
var dateHelper = require("../middlewares/date");

var request = require("../middlewares/request");

module.exports = React.createClass({
  displayName: "IndexPage",
  getInitialState: function() {
    return {
      log: [],
      eventList: [],
    };
  },
  componentDidMount: function() {
    request.get("/users/me/points", function (err, res) {
      if (res.status !== 200) return;
      this.setState({log: res.body.points});
    }.bind(this));
    request.get("/events/upcoming", function (err, res) {
      if (res.status !== 200) return;
      this.setState({eventList: res.body.events});
    }.bind(this));
  },
  render: function() {
    return (
      <div>
        <ApplyToEvent eventList={this.state.eventList} />
        <PointsLog log={this.state.log} />
      </div>
    );
  }
});
