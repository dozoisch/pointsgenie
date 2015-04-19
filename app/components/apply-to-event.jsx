"use strict";
import React, { PropTypes } from "react";

import ApplicationWrapper from "./application/wrapper";
import EventStore from "../stores/event";
import request from "../middlewares/request";

const ApplyToEvent = React.createClass({
  displayName: "ApplyToEvent",

  propTypes: {
    promocard: PropTypes.shape({
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      date: PropTypes.instanceOf(Date)
    }),
  },

  getInitialState() {
    return { events: [], };
  },

  componentDidMount() {
    this.loadEvents();
  },

  loadEvents() {
    request.get("/events/upcoming", (err, res) => {
      if (err || res.status !== 200)  { return; }

      var sei = this.state.sei > res.body.events.length ?
        0 : this.state.sei;

      this.setState({
        events: res.body.events.map(function (event) {
          return EventStore.parseEvent(event);
        }),
        selectedEventIndex: sei,
      });
    });
  },

  handleFormSubmit(e) {
    e.preventDefault();
    if (!this.refs.wrapper.isValid()) {
      return;
    }
    this.setState({ isSubmitting: true });
    const formData = this.refs.wrapper.getFormData();
    const event = this.refs.wrapper.getSelectedEvent();
    const url = "/apply/" + event.id;
    request.post(url, formData, (err, res) => {
      let state = { isSubmitting: false };
      if (err) {
        state.alert = { style: "danger", message: `Erreur non-controlée: ${err.message}` };
      } else if (res.status === 200) {
        state.alert = { style: "success", message: `Postulance acceptée pour ${event.name}!` };
      } else {
        state.alert = { style: "danger", message: res.body.error };
      }
      this.setState(state, this.loadEvents);
    });
  },

  handleAlertDismiss() {
    this.setState({ alert: undefined });
  },

  render() {
    if (this.props.promocard && this.props.promocard.date) {
      return (
        <ApplicationWrapper ref="wrapper" eventList={this.state.events} isFormSubmitting={this.state.isFormSubmitting}
          alert={this.state.alert} onAlertDismiss={this.handleAlertDismiss}
          onFormSubmit={this.handleFormSubmit}
        />
      );
    } else {
      return (
        <div className="apply-event">
          <h3>Postuler pour un événement</h3>
          <div>Vous devez avoir une promocarte afin de pouvoir postuler à un événement.
          Veuillez contacter votre association étudiante</div>
        </div>
      );
    }
  },
});

export default ApplyToEvent;
