/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Input = require("react-bootstrap/Input");
var Button = require("react-bootstrap/Button");

var DateTimePicker = require("./date-time-picker");
var TagListInput = require("./tag-list-input");

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
  },
  handleChange: function () {
    console.log(this.refs.name.getValue());
    console.log(this.refs.startDate.getValue());
    console.log(this.refs.startDate.getValue());
  },
  render: function () {
    return (
      <form onSubmit={this.props.onSubmit} role="form">
        <Input type="text" ref="name" label="Nom" placeholder="nom de l'événement"
         value={this.props.event.name} onChange={this.handleChange} />
        <DateTimePicker ref="startDate" label="Date et heure de début"
          defaultDate={this.props.event.startDate}
          datePlaceholder="date de début" onChange={this.handleChange} />
        <DateTimePicker ref="endDate" label="Date et heure de fin"
          defaultDate={this.props.event.endDate}
          datePlaceholder="date de fin" onChange={this.handleChange} />
        <TagListInput ref="roles" label="Liste des tâches" defaultTags={this.props.event.tasks} />
      </form>
    );
  }
});
