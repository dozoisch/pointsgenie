/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Input = require("react-bootstrap/Input");
var Button = require("react-bootstrap/Button");


module.exports = React.createClass({
  propTypes: {
    event: PropTypes.shape({
      name: PropTypes.string,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    }).isRequired
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
      <div class="postulate-event">
        <h3>Postuler pour {this.state.event.name} ({this.sate.event.date})</h3>
        <form onSubmit={this.handleSubmit} role="form">
        <fieldset>
          {this.renderSubmitButton()}
        </fieldset>
        </form>
      </div>
    );
  }
});
