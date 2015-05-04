import React, { PropTypes } from "react";

import connectToStore from "flummox/connect";

import ApplyToEventSelector from "./ApplyToEventSelector";
import Event from "../../models/Event";
import request from "../../middlewares/request";

const ApplyToEvent = React.createClass({
  displayName: "ApplyToEvent",

  contextTypes: {
    flux: PropTypes.object,
  },

  propTypes: {
    promocard: PropTypes.shape({
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      date: PropTypes.instanceOf(Date),
    }),
  },

  getInitialState() {
    return { events: [], };
  },

  handleFormSubmit(e) {
    e.preventDefault();
    if (!this.refs.wrapper.isValid()) {
      return;
    }
    this.setState({ isSubmitting: true });
    const formData = this.refs.wrapper.getFormData();
    const url = "/application";
    request.post(url, formData, (err, res) => {
      let state = { isSubmitting: false };
      if (err) {
        state.alert = { style: "danger", message: `Erreur non-controlée: ${err.message}` };
      } else if (res.status === 200) {
        state.alert = { style: "success", message: `Postulance acceptée pour ${event.name}!` };
      } else {
        state.alert = { style: "danger", message: res.body.error };
      }
      this.setState(state, () => this.context.flux.getActions("event").fetchUpcomingEvents());
    });
  },

  handleAlertDismiss() {
    this.setState({ alert: undefined });
  },

  render() {
    if (this.props.promocard && this.props.promocard.date) {
      return (
        <ApplyToEventSelector ref="wrapper" eventList={this.props.events} isFormSubmitting={this.state.isFormSubmitting}
          alert={this.state.alert} onAlertDismiss={this.handleAlertDismiss}
          onFormSubmit={this.handleFormSubmit}
        />
      );
    } else {
      return (
        <div className="apply-event">
          <h3>Postuler pour un événement</h3>
          <p>
            Vous devez avoir une promocarte afin de pouvoir postuler à un événement.
            Veuillez contacter votre association étudiante
          </p>
          {this.renderPossibleEventList()}
        </div>
      );
    }
  },

  renderPossibleEventList() {
    const eventList = this.props.events.map(event => (<li key={event.id}>{event.name}</li>));
    if (eventList.length > 0) {
      return (
        <div>
          <h4>Liste d'événements auxquels vous pourriez postuler</h4>
          <ul>
            {eventList}
          </ul>
        </div>
      );
    }
  }
});

const ConnectedApplyToEvent = connectToStore(ApplyToEvent, {
  event: store => ({
    events: store.getUpcomingEvents(),
  })
});

export default ConnectedApplyToEvent;
