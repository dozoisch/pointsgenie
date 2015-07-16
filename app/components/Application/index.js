import React, { PropTypes } from "react";

import { Button } from "react-bootstrap";

import ApplicationAvailability from "./ApplicationAvailability";
import ApplicationTasksPreference from "./ApplicationTasksPreference";

const Application = React.createClass({
  displayName: "Application",

  propTypes: {
    // Event
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    obligatoryHours: PropTypes.number.isRequired,
    tasks: PropTypes.arrayOf(PropTypes.string).isRequired,
    // Application
    preferredTask: PropTypes.string,
    availabilities: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    // Others
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    isSubmitting: PropTypes.bool,
    readOnly: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      isSubmitting: false,
      isValid: true,
    };
  },

  getInitialState() {
    return this.getStateFromProps(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this.setState(this.getStateFromProps(nextProps));
  },

  getStateFromProps(props) {
    const { preferredTask, availabilities } = props;
    let state = {
      preferredTask,
    };
    if (availabilities) {
      state.availabilities = availabilities.map(d => d.toISOString());
    } else {
      state.availabilities = this.state ? this.state.availabilities : [];
    }
    return state;
  },

  getFormData() {
    return {
      preferredTask: this.state.preferredTask,
      availabilities: this.state.availabilities.map(d => new Date(d)),
    };
  },

  isValid() {
    return this.state.availabilities.length > 0;
  },

  renderSubmitButton() {
    if (this.props.readOnly) {
      return null;
    }
    return (
      <Button type="submit" disabled={!this.isValid() || this.props.isSubmitting} bsStyle="success">
        {this.props.isSubmitting ? "Postulance en cours...": "Postuler"}
      </Button>
    );
  },

  handleTaskPreferenceChange() {
    const preferredTask = this.refs.taskPreference.getFormData();
    this.setState({
      preferredTask,
    }, this.props.onChange);
  },

  handleAvailabilityChange() {
    const availabilities = this.refs.availabilities.getFormData();
    this.setState({
      availabilities,
    }, this.props.onChange);
  },

  render() {
    return (
      <form onSubmit={this.props.onSubmit} role="form">
        <fieldset>
          <h4>Tâche préférée</h4>
          <ApplicationTasksPreference ref="taskPreference" onChange={this.handleTaskPreferenceChange}
            tasks={this.props.tasks} value={this.state.preferredTask} readOnly={this.props.readOnly} />
          <h4>Disponibilités</h4>
          <ApplicationAvailability ref="availabilities" onChange={this.handleAvailabilityChange}
            valid={this.isValid()} readOnly={this.props.readOnly} values={this.state.availabilities}
            startDate={this.props.startDate} endDate={this.props.endDate} obligatoryHours={this.props.obligatoryHours}/>
        {this.renderSubmitButton()}
        </fieldset>
      </form>
    );
  }
});

export default Application;
