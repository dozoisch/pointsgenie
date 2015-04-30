import React, { PropTypes } from "react";

import EventStore from "../stores/event";
import EventForm from "../components/event-form";

const AdminEvent = React.createClass({
  displayName: "AdminEvent",

  contextTypes: {
    router: PropTypes.func
  },

  componentWillMount() {
    EventStore.init();
  },

  componentDidMount() {
    EventStore.addChangeListener(this.updateEvent);
  },

  componentWillUnmount() {
    EventStore.removeChangeListener(this.updateEvent);
  },

  getInitialState () {
    if (this.context.router.getCurrentParams().id === undefined) {
      return { event : {} };
    }
    return {
     event : EventStore.getEvent(this.context.router.getCurrentParams().id) || {},
    };
  },

  updateEvent () {
    if(!this.isMounted()) {
      return;
    }
    this.setState({
      event: EventStore.getEvent(this.context.router.getCurrentParams().id) || {},
    });
  },

  handleSubmit (e) {
    e.preventDefault();
    if (this.refs.form.isValid()) {
      let event = this.refs.form.getFormData();
      let method = "addEvent";
      let { id } = this.context.router.getCurrentParams();
      if (id !== undefined) {
        method = "updateEvent";
        event.id = id;
      }
      let callback = function () {
        this.context.router.transitionTo("/");
      }.bind(this);
      EventStore[method](event, callback);
    }
  },

  render () {
    const isNew = this.context.router.getCurrentParams().id === undefined;

    return (
      <div className="event-form">
        <h3>{isNew ? "Créer un événement" : "Modifier un événement"}</h3>
        <EventForm ref="form" onSubmit={this.handleSubmit} event={this.state.event}/>
      </div>
    );
  },

});

export default AdminEvent;
