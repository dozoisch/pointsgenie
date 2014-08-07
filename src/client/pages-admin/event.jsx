/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;

var EventStore = require("../stores/event");
var EventForm = require("../components/event-form");

module.exports = React.createClass({
  displayName: "AdminEvent",
  propTypes: {
    params: PropTypes.object,
  },
  getInitialState: function () {
    if (this.props.params.id === undefined) {
      return { event : {} };
    }
    return {
     event : EventStore.getEvent(this.props.param),
    };
  },
  handleSubmit: function () {

  },
  render: function () {
    var isNew = this.props.params.id === undefined;

    return (
      <div className="event-form">
        <h3>{isNew ? "Créer un événement" : "Modifier un événement"}</h3>
        <EventForm onSubmit={this.handleSubmit} event={this.state.event}/>
      </div>
    );
  }
});
