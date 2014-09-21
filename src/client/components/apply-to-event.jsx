/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Input = require("react-bootstrap/Input");
var Alert = require("react-bootstrap/Alert");
var ApplicationForm = require("./application/form");

var dateHelper = require("../middlewares/date");
var request = require("../middlewares/request");

module.exports = React.createClass({
  displayName: "ApplyToEvent",
  propTypes: {
    eventList: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        startDate: PropTypes.instanceOf(Date).isRequired,
        endDate: PropTypes.instanceOf(Date).isRequired,
        tasks: PropTypes.arrayOf(PropTypes.string).isRequired,
      })
    ).isRequired,
    defaultSelectedEventIndex: PropTypes.number,
  },
  getDefaultProps: function () {
    return {
      defaultSelectedEventIndex: 0,
    };
  },
  getInitialState: function () {
    var sei = this.props.defaultSelectedEventIndex > this.props.eventList.length ?
      0 : this.props.defaultSelectedEventIndex;
    return {
      selectedEventIndex: sei,
      isFormSubmitting: false,
      isFormValid: false,
    };
  },
  getSelectedEvent: function () {
    var index = this.state.selectedEventIndex > this.props.eventList.length ?
      0 : this.state.selectedEventIndex;
    return this.props.eventList[index];
  },
  handleFormSubmit: function (e) {
    e.preventDefault();
    if (!this.refs.applicationForm.isValid()) {
      this.setState({isFormValid: false});
      return;
    }
    this.setState({isSubmitting: true});
    var formData = this.refs.applicationForm.getFormData();
    var url = "/apply/" + this.getSelectedEvent().id;
    request.post(url, formData, function (err, res) {
      var state = { isSubmitting: false };
      if (err) {
        state.alert = { style: "danger", message: "Erreur non-controlée: " + err.message };
      } else if (res.status === 200) {
        state.alert = { style: "success", message: "Postulance acceptée!" };
      } else {
        state.alert = { style: "danger", message: res.body.error };
      }
      this.setState(state);
    }.bind(this));
  },
  handleAlertDismiss: function () {
    this.setState({ alert: undefined });
  },
  handleFormChange: function () {
    this.setState({ isFormValid: this.refs.applicationForm.isValid() });
  },
  handleDropdownChange : function () {
    if (this.props.eventList.length === 0) {
      return;
    }
    this.setState({ selectedEventIndex: this.refs.eventSelect.getDOMNode().value});
  },
  renderMessage: function () {
    if(this.state.alert) {
      return (
        <Alert bsStyle={this.state.alert.style} onDismiss={this.handleAlertDismiss}>
          {this.state.alert.message}
        </Alert>
      );
    }
    return null;
  },
  renderEventList: function () {
    if (this.props.eventList.length === 0) {
      return (<p>Il n'y a aucun événement de prévu.</p>);
    }
    var options = this.props.eventList.map(function (entry, index) {
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
  renderForm: function () {
    if(this.props.eventList.length === 0) {
      return (null);
    }
    var event = this.getSelectedEvent();

    return (
      <ApplicationForm ref="applicationForm" key={event.id}
        startDate={event.startDate} endDate={event.endDate} tasks={event.tasks}
        isSubmitting={this.state.isFormSubmitting} isValid={this.state.isFormValid}
        onChange={this.handleFormChange} onSubmit={this.handleFormSubmit}
      />
    );
  },
  render: function() {
    return (
      <div className="apply-event">
        <h3>Postuler pour un événement</h3>
        {this.renderEventList()}
        {this.renderMessage()}
        {this.renderForm()}
      </div>
    );
  }
});
