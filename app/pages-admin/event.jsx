"use strict";
import React, { PropTypes } from "react";

var EventStore = require("../stores/event");
var EventForm = require("../components/event-form");

module.exports = React.createClass({
  displayName: "AdminEvent",

  contextTypes: {
    router: PropTypes.func
  },

  componentWillMount: function () {
    EventStore.init();
  },
  componentDidMount: function () {
    EventStore.addChangeListener(this.updateEvent);
  },
  componentWillUnmount: function() {
    EventStore.removeChangeListener(this.updateEvent);
  },
  getInitialState: function () {
    if (this.context.router.getCurrentParams().id === undefined) {
      return { event : {} };
    }
    return {
     event : EventStore.getEvent(this.context.router.getCurrentParams().id),
    };
  },
  updateEvent: function () {
    if(!this.isMounted()) {
      return;
    }
    this.setState({
      event: EventStore.getEvent(this.context.router.getCurrentParams().id),
    });
  },
  handleSubmit: function (e) {
    e.preventDefault();
    if (this.refs.form.isValid()) {
      var event = this.refs.form.getFormData();
      var method = "addEvent";
      var { id } = this.context.router.getCurrentParams();
      if (id !== undefined) {
        method = "updateEvent";
        event.id = id;
      }
      var callback = function () {
        this.context.router.transitionTo("/");
      }.bind(this);
      EventStore[method](event, callback);
    }
  },
  render: function () {
    var isNew = this.context.router.getCurrentParams().id === undefined;

    return (
      <div className="event-form">
        <h3>{isNew ? "Créer un événement" : "Modifier un événement"}</h3>
        <EventForm ref="form" onSubmit={this.handleSubmit} event={this.state.event}/>
      </div>
    );
  }
});
