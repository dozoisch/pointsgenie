import React, { PropTypes } from "react";
import { Input, Button, Alert } from "react-bootstrap";

import request from "../middlewares/request";

const PasswordChange = React.createClass({
  displayName: "PasswordChange",

  propTypes: {
    hasPassword: PropTypes.bool,
  },

  getInitialState() {
    return {};
  },

  validatePassword() {
    let pw1 = this.refs.newPw1.getValue();
    let pw2 = this.refs.newPw2.getValue();
    if (pw1 === "" && pw2 === "") {
      this.setState({newBsStyle: undefined, validates: false});
    } else if (pw1 === pw2) {
      this.setState({newBsStyle: "success", validates: true});
    } else {
      this.setState({newBsStyle: "error", validates: false});
    }
  },

  handleSubmit(e) {
    e.preventDefault();
    this.setState({isSubmitting: true});
    let refs = this.refs;
    let formData = {};
    for (let key of Object.keys(refs)) {
      formData[key] = refs[key].getValue();
    };
    // @TODO refactor that to UserStore/UserActions
    request.post("/users/me/password", formData, (err, res) => {
      let state = { isSubmitting: false };
      if (err) {
        state.alert = {style: "danger", message: "Erreur non-controlée: " + err.message};
      } else if (res.status === 200) {
        state.alert = {style: "success", message: "Changement effectué!"};
      } else {
        state.alert = {style: "danger", message: res.body.error};
      }
      this.setState(state);
    });
  },

  handleAlertDismiss() {
    this.setState({ alert: undefined });
  },

  renderMessage() {
    if(this.state.alert) {
      return (
        <Alert bsStyle={this.state.alert.style} onDismiss={this.handleAlertDismiss}>
          {this.state.alert.message}
        </Alert>
      );
    }
    return null;
  },

  renderOldPassword() {
    if(this.props.hasPassword) {
      return (
          <Input
            type="password" label="Mot de passe actuel"
            labelClassName="col-md-3" wrapperClassName="col-md-6"
            ref="currPw" placeholder="actuel"
            onChange={this.validatePassword}
          />
      );
    }
    return (
      <Input type="static" label="Mot de passe actuel"
        labelClassName="col-md-3" wrapperClassName="col-md-6"
        value="Vous n'avez pas encore de mot de passe"
      />
    );
  },

  renderSubmitButton() {
    const disabled = !this.state.validates || this.state.isSubmitting;
    return (
      <Button type="submit" disabled={disabled} bsStyle="success">
        {this.state.isSubmitting ? "Changement en cours...": "Changer mot de passe"}
      </Button>
    );
  },

  render() {
    return (
      <div className="user-password-change">
        <h4>Changer de mot de passe</h4>
        {this.renderMessage()}
        <form onSubmit={this.handleSubmit} className="form-horizontal" role="form">
          {this.renderOldPassword()}
          <Input
            type="password" label="Nouveau mot de passe"
            labelClassName="col-md-3" wrapperClassName="col-md-6"
            ref="newPw1" placeholder="nouveau"
            onChange={this.validatePassword}
          />
          <Input
            type="password" label="Répéter mot de passe"
            labelClassName="col-md-3" wrapperClassName="col-md-6"
            ref="newPw2" placeholder="répéter" bsStyle={this.state.newBsStyle}
            hasFeedback onChange={this.validatePassword}
          />
          {this.renderSubmitButton()}
        </form>
      </div>
    );
  },
});

export default PasswordChange;
