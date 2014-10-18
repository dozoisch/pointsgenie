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
      eventList: [],
    };
  },
  componentDidMount: function() {
    request.get("/users/me", function (err, res) {
      if (err || res.status !== 200) return;
      this.setState({ user: res.body.user });
    }.bind(this));

    request.get("/events/upcoming", function (err, res) {
      if (err || res.status !== 200) return;
      this.setState({
        eventList: res.body.events.map(function (event) {
          return parseEvent(event);
        }),
      });
    }.bind(this));
  },
  renderApplyToEvent: function () {
    if (this.state.user && this.state.user.promocard && this.state.user.promocard.date) {
      return (<ApplyToEvent eventList={this.state.eventList} />);
    } else {
      // @TODO... this should stay in apply to event... split files in 2 to handle this case
      return (
        <div className="apply-event">
          <h3>Postuler pour un événement</h3>
          <div>Vous devez avoir une promocarte afin de pouvoir postuler à un événement.
          Veuillez contacter votre association étudiante</div>
        </div>
      );
    }

  },
  renderPointsLog: function () {
    if (this.state.user) {
        return (<PointsLog log={this.state.user.points} />);
    } else {
      return (<div>Chargement...</div>);
    }
  },
  render: function() {
    return (
      <div class="index-page">
        {this.renderApplyToEvent()}
        {this.renderPointsLog()}
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
