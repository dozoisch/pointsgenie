"use strict";
var React = require("react");
var PropTypes = React.PropTypes;

var SpinnerInput = require("./utils/spinner-input");

var Modal = require("react-bootstrap/Modal");
var Input = require("react-bootstrap/Input");
var Button = require("react-bootstrap/Button");

module.exports = React.createClass({
  displayName: "AwardPointsModal",
  propTypes: {
    user: PropTypes.object,
    onFormSubmit: PropTypes.func.isRequired,
  },
  getInitialState: function () {
    return {
      invalid: {},
      points: 0,
    };
  },
  getFormData: function () {
    return {
      points: this.state.points,
      reason: this.state.reason,
    }
  },
  isValidPoints: function (points) {
    return isNaN(points) || (points < 0.1 && points > -0.1)
  },
  handlePointsUpClick: function () {
    var points = parseFloat(this.state.points, 10);
    if (this.isValidPoints(points)) {
      points = 0;
    }
    this.setState({
      points: points + 0.5,
    }, this.handleChange);
  },
  handlePointsDownClick: function () {
    var points = parseFloat(this.state.points, 10);
    if (this.isValidPoints(points)) {
      points = 0;
    }
    this.setState({
      points: points - 0.5,
    }, this.handleChange);
  },
  handleChange: function () {
    var state = {
      isValid: true,
      invalid: {},
      points: this.refs.points.getValue(),
      reason: this.refs.reason.getValue(),
    };
    var points = parseFloat(state.points, 10);
    if (this.isValidPoints(points)) {
      state.isValid = false;
      state.invalid.points = true;
    }

    this.setState(state);
  },
  handleSubmit: function (e) {
    this.props.onRequestHide();
    this.props.onFormSubmit(this.props.user.id, this.getFormData(), e);
  },
  renderPointsInput: function () {
    var isValid = !this.state.invalid.points;
    return (
      <SpinnerInput type="text" ref="points" label="Points" placeholder="0.0" value={this.state.points}
        help={isValid ? null : "Vous devez entrer un nombre valide de points."} bsStyle={isValid ? null : "error" } hasFeedback
        onUpClick={this.handlePointsUpClick} onDownClick={this.handlePointsDownClick} onChange={this.handleChange} />
    );
  },
  renderReasonInput: function () {
    return (
      <Input type="text" ref="reason" label="Raison" placeholder="raison de l'ajout/retrait des points"
        value={this.state.reason} onChange={this.handleChange} />
    );
  },
  renderSubmitButton: function () {
    return (
      <Button type="submit" disabled={!this.state.isValid || this.props.isSubmitting} bsStyle="success" >
        Attribuer les points
      </Button>
    );
  },
  render: function() {
    var title = "Attribuer des points à " + this.props.user.name;
    return this.transferPropsTo(
      <Modal title={title} animation={true}>
        <form onSubmit={this.handleSubmit} role="form">
        <div className="modal-body">
          {this.renderPointsInput()}
          {this.renderReasonInput()}
        </div>
        <div className="modal-footer">
          {this.renderSubmitButton()}
        </div>
        </form>
      </Modal>
    );
  }
});
