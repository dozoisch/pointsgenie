/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Input = require("react-bootstrap/Input");
var Button = require("react-bootstrap/Button");

var DateTimePicker = require("./date-time-picker/picker");
var TagListInput = require("./tag-list-input/tag-list");

module.exports = React.createClass({
  displayName: "AdminEventForm",
  propTypes: {
    onSubmit: PropTypes.func.isRequired,
    event: PropTypes.shape({
      name: PropTypes.string,
      startDate: PropTypes.instanceOf(Date),
      endDate: PropTypes.instanceOf(Date),
      tasks: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    isSubmitting: PropTypes.bool,
  },
  getInitialState: function () {
    return this.getStateFromProps(this.props);
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(this.getStateFromProps(nextProps));
  },
  getStateFromProps: function (props) {
    var rawTasks = this.props.event.tasks || [];
    var tasks = rawTasks.map(function (element) {
      // Naive implementation where the key is the string value
      return createTagObject(element);
    });
    return {
      tasks: tasks,
      name: props.event.name,
      startDate: props.event.startDate,
      endDate: props.event.endDate,
      wildcardTask: props.event.wildcardTask,
      invalid: {},
    };
  },
  getFormData: function () {
    var tasks = this.state.tasks.map(function (element) {
      return element.value;
    });
    return {
      name: this.state.name,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      tasks: tasks,
      wildcardTask: this.state.wildcardTask,
    };
  },
  isValid: function () {
    return this.state.isValid;
  },
  handleRemoveTag: function (key) {
    this.setState({
      tasks: this.state.tasks.filter(function (value, i) {
        return key !== value.key;
      }),
    }, this.handleChange);
  },
  handleNewTag: function (value) {
    var newTask = createTagObject(value);
    var tasks = this.state.tasks;
    for (var i = 0; i < tasks.length; ++i) {
      // dont do anything on duplicate
      if (tasks[i].key === newTask.key) {
        return;
      }
    };

    this.setState({
      tasks: tasks.concat([newTask]),
    }, this.handleChange);
  },
  handleChange: function () {
    var state = {
      isValid: true,
      invalid: {},
      name: this.refs.name.getValue(),
      startDate: this.refs.startDate.getValue(),
      endDate: this.refs.endDate.getValue(),
    };

    // chaining validation results in a more user friendly validation!
    // One field red at the time instead of a full form
    if (state.name.length < 1) {
      state.isValid = false;
      state.invalid.name = true;
    }
    else if (!state.startDate || isNaN(state.startDate.getTime())) {
      state.isValid = false;
      state.invalid.startDate = true;
    }
    else if (!state.endDate || isNaN(state.endDate.getTime()) || // at least one hour
      state.endDate.getTime() < (state.startDate.getTime() + 60)) {
      state.isValid = false;
      state.invalid.endDate = true;
    }
    else if (this.state.tasks.length < 1) {
      state.isValid = false;
      state.invalid.tasks = true;
    }

    this.setState(state);
  },
  renderNameInput: function () {
    var isValid = !this.state.invalid.name;
    return (
      <Input type="text" ref="name" label="Nom" placeholder="nom de l'événement" value={this.state.name}
        help={isValid ? null : "Le nom doit être d'au moins un caractère"}
        bsStyle={isValid ? null : "error" } hasFeedback onChange={this.handleChange} />
    );
  },
  renderStartDateInput : function () {
    var isValid = !this.state.invalid.startDate;
    return (
      <DateTimePicker ref="startDate" label="Date et heure de début" datePlaceholder="date de début"
        date={this.state.startDate} bsStyle={isValid ? null : "error" }
        help={isValid ? null : "Veuillez entrer une date valide" }
        onChange={this.handleChange} />
    );
  },
  renderEndDateInput : function () {
    var isValid = !this.state.invalid.endDate;
    return (
      <DateTimePicker ref="endDate" label="Date et heure de fin" datePlaceholder="date de fin"
        date={this.state.endDate} bsStyle={isValid ? null : "error" }
        help={isValid ? null : "Veuillez une date au moins une heure plus grande que la date de début" }
        onChange={this.handleChange} />
    );
  },
  renderTagListInput: function () {
    return(
      <TagListInput ref="tasks" label="Liste des tâches" placeholder="nouvelle tâche"
        help="Appuyez sur la virgule pour séparer les éléments"
        tags={this.state.tasks} isInvalid={this.state.invalid.tasks}
        onRemove={this.handleRemoveTag} onNew={this.handleNewTag} />
    );
  },
  renderSubmitButton: function () {
    return (
      <Button type="submit" disabled={!this.state.isValid || this.props.isSubmitting} bsStyle="success">
        { this.props.isSubmitting ? "En cours...": "Soumettre" }
      </Button>
    );
  },
  render: function () {
    return (
      <form onSubmit={this.props.onSubmit} role="form">
        {this.renderNameInput()}
        {this.renderStartDateInput()}
        {this.renderEndDateInput()}
        {this.renderTagListInput()}
        {this.renderSubmitButton()}
      </form>
    );
  }
});

function createTagObject(value) {
  return {value: value, key: value.toUpperCase()}
}
