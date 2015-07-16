import React, { PropTypes } from "react";
import { Input, Alert } from "react-bootstrap";

import Application from "../Application";

const ApplyToEventSelector = React.createClass({
  displayName: "ApplyToEventSelector",

  propTypes: {
    eventList: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        startDate: PropTypes.instanceOf(Date).isRequired,
        endDate: PropTypes.instanceOf(Date).isRequired,
        obligatoryHours: PropTypes.number,
        tasks: PropTypes.arrayOf(PropTypes.string).isRequired,
      })
    ).isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    onAlertDismiss: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      selectedEventIndex: 0,
      isFormValid: false,
    };
  },

  isValid() {
    return this.refs.applicationForm.isValid();
  },

  getFormData() {
    return {
      event: this.getSelectedEvent().id,
      application: this.refs.applicationForm.getFormData(),
    };
  },

  handleDropdownChange () {
    if (this.props.eventList.length === 0) {
      return;
    }
    this.setState({ selectedEventIndex: this.refs.eventSelect.getDOMNode().value});
  },

  getSelectedEvent() {
    let index = this.state.selectedEventIndex > this.props.eventList.length ?
      0 : this.state.selectedEventIndex;
    return this.props.eventList[index];
  },

  renderMessage() {
    if (this.props.alert) {
      return (
        <Alert bsStyle={this.props.alert.style} onDismiss={this.props.onAlertDismiss}>
          {this.props.alert.message}
        </Alert>
      );
    }
    return null;
  },

  renderEventList() {
    if (this.props.eventList.length === 0) {
      return (<p>Il n'y a aucun événement de prévu sur lequel vous n'avez pas déjà postulé.</p>);
    }
    const options = this.props.eventList.map((entry, index) => {
      return (
        <option value={index} key={entry.id}>
          {entry.name} ({entry.startDate.toLocaleDateString()})
        </option>
      );
    });
    return (
      <span>Postuler pour
        <select ref="eventSelect" type="select" onChange={this.handleDropdownChange}
          className="form-control application-event-selector" value={this.state.selectedEventIndex}
        >
          {options}
        </select>
      </span>
    );
  },

  renderForm() {
    if(this.props.eventList.length === 0) {
      return (null);
    }
    const event = this.getSelectedEvent();
    return (
      <Application ref="applicationForm" key={event.id}
        startDate={event.startDate} endDate={event.endDate} tasks={event.tasks}
        obligatoryHours={event.obligatoryHours}
        isSubmitting={this.props.isFormSubmitting}
        onSubmit={this.props.onFormSubmit}
      />
    );
  },

  render() {
    return (
      <div className="apply-event">
        <h3>Postuler pour un événement</h3>
        {this.renderMessage()}
        {this.renderEventList()}
        {this.renderForm()}
      </div>
    );
  }
});

export default ApplyToEventSelector;
