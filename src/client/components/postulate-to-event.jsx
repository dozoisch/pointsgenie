/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Input = require("react-bootstrap/Input");
var Button = require("react-bootstrap/Button");

module.exports = React.createClass({
  displayName: "PostulateToEvent",
  getInitialState: function() {
    return {};
  },
  propTypes: {
    event: PropTypes.shape({
      name: PropTypes.string,
      date: PropTypes.string,
    }).isRequired
  },
  validateForm: function () {
    this.setState({validates: false});
  },
  handleSubmit: function (e) {
    e.preventDefault();
    this.setState({isSubmitting: true});
  },
  renderSubmitButton: function () {
    var disabled = !this.state.validates || this.state.isSubmitting;
    return (
      <Button type="submit" disabled={disabled} bsStyle="success">
        {this.state.isSubmitting ? "Enregistrement en cours...": "Postuler"}
      </Button>
    );
  },
  render: function() {
    return (
      <div className="postulate-event">
        <h3>Postuler pour {this.props.event.name} ({this.props.event.date})</h3>
        <form onSubmit={this.handleSubmit} role="form">
        <fieldset>
          {this.renderSubmitButton()}
        </fieldset>
        </form>
      </div>
    );
  }
});
