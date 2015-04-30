import React, { PropTypes } from "react";
import { Modal, Input, Button} from "react-bootstrap";

import SpinnerInput from "./utils/spinner-input";

const AwardPointsModal = React.createClass({
  displayName: "AwardPointsModal",

  propTypes: {
    user: PropTypes.object,
    onFormSubmit: PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      invalid: {},
      points: 0,
    };
  },

  getFormData() {
    return {
      points: this.state.points,
      reason: this.state.reason,
    }
  },

  isValidPoints(points) {
    return isNaN(points) || (points < 0.1 && points > -0.1)
  },

  handlePointsUpClick() {
    let points = parseFloat(this.state.points, 10);
    if (this.isValidPoints(points)) {
      points = 0;
    }

    this.setState({
      points: points + 0.5,
    }, this.handleChange);
  },

  handlePointsDownClick() {
    let points = parseFloat(this.state.points, 10);
    if (this.isValidPoints(points)) {
      points = 0;
    }

    this.setState({
      points: points - 0.5,
    }, this.handleChange);
  },

  handleChange() {
    let state = {
      isValid: true,
      invalid: {},
      points: this.refs.points.getValue(),
      reason: this.refs.reason.getValue(),
    };

    let points = parseFloat(state.points, 10);
    if (this.isValidPoints(points)) {
      state.isValid = false;
      state.invalid.points = true;
    }

    this.setState(state);
  },

  handleSubmit(e) {
    this.props.onRequestHide();
    this.props.onFormSubmit(this.props.user.id, this.getFormData(), e);
  },

  renderPointsInput() {
    const isValid = !this.state.invalid.points;
    return (
      <SpinnerInput type="text" ref="points" label="Points" placeholder="0.0" value={this.state.points} hasFeedback
        help={isValid ? null : "Vous devez entrer un nombre valide de points."} bsStyle={isValid ? null : "error" }
        onUpClick={this.handlePointsUpClick} onDownClick={this.handlePointsDownClick} onChange={this.handleChange} />
    );
  },

  renderReasonInput() {
    return (
      <Input type="text" ref="reason" label="Raison" placeholder="raison de l'ajout/retrait des points"
        value={this.state.reason} onChange={this.handleChange} />
    );
  },

  renderSubmitButton() {
    return (
      <Button type="submit" disabled={!this.state.isValid || this.props.isSubmitting} bsStyle="success" >
        Attribuer les points
      </Button>
    );
  },

  render() {
    let { user, onFormSubmit, isSubmitting, ...props } = this.props;
    const title = `Attribuer des points à ${user.name}`;

    return (
      <Modal {...props} title={title} animation={true}>
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

export default AwardPointsModal;
