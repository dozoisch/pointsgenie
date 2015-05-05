import React, { Component, PropTypes } from "react";

import connectToStore from "flummox/connect";

import EventForm from "../components/event-form";

class AdminEventPage extends Component {
  static displayName = "AdminEventPage";

  static contextTypes = {
    router: PropTypes.func,
    flux: PropTypes.object,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.refs.form.isValid()) {
      const { id } = this.context.router.getCurrentParams();
      let event = this.refs.form.getFormData();
      let promise;
      if (id !== undefined) {
        event.id = id;
        promise = this.context.flux.getActions("event").updateEvent(event);
      } else {
        promise = this.context.flux.getActions("event").createEvent(event);
      }
      promise.then(() => this.context.router.transitionTo("/"));
    }
  }

  render() {
    const isNew = this.context.router.getCurrentParams().id === undefined;

    return (
      <div className="event-form">
        <h3>{isNew ? "Créer un événement" : "Modifier un événement"}</h3>
        <EventForm ref="form" onSubmit={this.handleSubmit} event={this.props.event}/>
      </div>
    );
  }
};

const ConnectedEvent = connectToStore(AdminEventPage, {
  event: (store, props) => {
    if (props.eventId === undefined) {
      return { event: {} };
    }
    return {
      event: store.getEvent(props.eventId) || {},
    };
  }
});

class WrappedEvent extends Component {
  static contextTypes = {
    router: PropTypes.func,
  }

  render() {
    const { id } = this.context.router.getCurrentParams();
    return (<ConnectedEvent {...this.props} eventId={id} />);
  }
}

export default WrappedEvent;
