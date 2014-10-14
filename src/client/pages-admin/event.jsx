/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;

var EventStore = require("../stores/event");
var EventForm = require("../components/event-form");

var Navigation = require("react-router").Navigation;

module.exports = React.createClass({
  displayName: "AdminEvent",
  mixins: [Navigation],
  propTypes: {
    params: PropTypes.object,
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
    if (this.props.params.id === undefined) {
      return { event : {} };
    }
    return {
     event : EventStore.getEvent(this.props.params.id),
    };
  },
  updateEvent: function () {
    if(!this.isMounted()) {
      return;
    }
    this.setState({
      event: EventStore.getEvent(this.props.params.id),
    });
  },
  handleSubmit: function (e) {
    e.preventDefault();
    if (this.refs.form.isValid()) {
      var event = this.refs.form.getFormData();
      var method = "addEvent";
      if (this.props.params.id !== undefined) {
        method = "updateEvent";
        event.id = this.props.params.id;
      }
      var callback = function () {
        this.transitionTo("/");
      }.bind(this);
      EventStore[method](event, callback);
    }
  },
  render: function () {
    var isNew = this.props.params.id === undefined;

    return (
      <div className="event-form">
        <h3>{isNew ? "Créer un événement" : "Modifier un événement"}</h3>
        <EventForm ref="form" onSubmit={this.handleSubmit} event={this.state.event}/>
      </div>
    );
  }
});
