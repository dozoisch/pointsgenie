import React, { PropTypes } from "react";

import { Link } from "react-router/build/npm/lib";
import { Jumbotron, Col, Input, Button, Row } from "react-bootstrap";

import connectToStore from "flummox/connect";

const SignIn = React.createClass({
  displayName: "SignInPage",

  contextTypes: {
    router: PropTypes.func,
    flux: PropTypes.object
  },

  handleSubmit(e) {
    e.preventDefault();
    const payload = {
      username: this.refs.username.getValue(),
      password: this.refs.password.getValue(),
    };
    this.context.flux.getActions("auth").signIn(payload)
      .then(() => {
        const redirect = this.props.attemptedTransition ||
          this.context.router.getCurrentQuery().redirect ||
          "index";
        return this.context.router.replaceWith(redirect);
      });
  },

  render() {
    const sitename = "Site des points génie";
    return (
      <div>
        <h1>Connexion <small>| {sitename}</small></h1>
        <Row>
          <Col md={4}>
            {this.renderForm()}
          </Col>
          <Col md={6}>
            <p>Vous devez vous connecter pour accéder au {sitename.toLowerCase()}!</p>
            <p>Pour vous connecter avec vos identifiants de l'université, appuyez sur le bouton USherbrooke.</p>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <ul className="otherlogins">
              <li>
                {this.renderUdeSButton()}
              </li>
            </ul>
          </Col>
        </Row>
      </div>
    );
  },

  renderForm() {
    return (
      <form onSubmit={this.handleSubmit} className={this.props.error ? "has-error" : null}>
        <Input type="text" ref="username" placeholder="cip" label="Cip" />
        <Input type="password" ref="password" placeholder="mot de passe" label="Mot de passe" />
        {this.renderErrorBlock()}
        <Button type="submit" bsStyle="success">Connexion</Button>
      </form>
    );
  },

  renderErrorBlock() {
    return this.props.error ?
      (<p className="help-block">Mauvaise combinaison Nom d'Utilisateur/Mot de Passe</p>) :
      null;
  },

  renderUdeSButton() {
    return (
      <Button bsStyle="default" bsSize="large" href="/auth/cas">
        <span className="udeslogo" />
        USherbrooke
      </Button>
    );
  }
});

const ConnectedSignIn = connectToStore(SignIn, {
  auth: store => ({
    error: store.getError(),
    attemptedTransition: store.getAttemptedTransition(),
  })
});

ConnectedSignIn.willTransitionTo = function(transition) {
  if (transition.context.flux.getStore("auth").getAuthenticatedUser()) {
    transition.redirect("index");
  }
};

export default ConnectedSignIn;
