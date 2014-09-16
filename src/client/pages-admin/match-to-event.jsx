/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;

var MatchingForm = require("../components/match-to-event-form");

module.exports = React.createClass({
  displayName: "AdminMatchToEvent",
  propTypes: {
  },
  getInitialState: function() {
    return {};
  },
  renderForm: function () {
    if (this.state.event && this.state.applications) {
      return (
        <MatchingForm event={this.state.event} applications={this.state.applications} />
      );
    } else {
      return (
        <div>Chargement...</div>
      );
    }
  },
  render: function () {
    return (
      <div className="match-to-event">
        {this.renderForm()}
      </div>
    );
  }
})
