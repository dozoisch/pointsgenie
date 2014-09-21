/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Button = require("react-bootstrap/Button");

var Availability = require("./availability");
var TaskPreferences = require("./tasks-preferences");

module.exports = React.createClass({
  displayName: "ApplicationForm",
  propTypes: {
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    tasks: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool,
    isValid: PropTypes.bool,
  },
  getDefaultProps: function () {
    return {
      isSubmitting: false,
      isValid: true,
    };
  },
  getFormData: function () {
    return {
      preferredTask: this.refs.taskPreference.getFormData(),
      availabilities: this.refs.hourCheckboxes.getFormData(),
    };
  },
  isValid: function () {
    return this.refs.taskPreference.isValid() && this.refs.hourCheckboxes.isValid();
  },
  renderSubmitButton: function () {
    return (
      <Button type="submit" disabled={!this.props.isValid || this.props.isSubmitting} bsStyle="success">
        {this.props.isSubmitting ? "Postulance en cours...": "Postuler"}
      </Button>
    );
  },
  render: function() {
    return (
      <form onSubmit={this.props.onSubmit} role="form">
        <fieldset>
          <h4>Tâche préférée {/*Postes demandés*/}</h4>
          <TaskPreferences ref="taskPreference" onChange={this.props.onChange}
            tasks={this.props.tasks} />
          <h4>Disponibilités</h4>
          <Availability ref="hourCheckboxes" onChange={this.props.onChange}
            startDate={this.props.startDate} endDate={this.props.endDate} />
        {this.renderSubmitButton()}
        </fieldset>
      </form>
    );
  }
});
