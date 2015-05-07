import React, { Component, PropTypes } from "react";
import TransitionGroup from "react/lib/ReactCSSTransitionGroup";
import connectToStore from "flummox/connect";

import { RouteHandler } from "react-router/build/npm/lib";
import { Nav, Row, Col } from "react-bootstrap";
import { NavItemLink } from "react-router-bootstrap";

import makeFullHeight from "../composition/makeFullHeight";

class UserLayout extends Component {
  static displayName = "UserLayout";

  static contextTypes = {
    router: PropTypes.func,
  };

  render() {
    const name = this.context.router.getCurrentPath();
    return (
      <div className="container content-wrapper">
      <Row>
        <Col md={2} role="navigation">
          <h3>Liens</h3>
          <Nav bsStyle="pills" stacked>
            <NavItemLink to="index">Accueil</NavItemLink>
            <NavItemLink to="applications">Postulations</NavItemLink>
            <NavItemLink to="profile">Profil</NavItemLink>
            <NavItemLink to="students">Liste des étudiants</NavItemLink>
            <NavItemLink to="faq">FAQ</NavItemLink>
          </Nav>
        </Col>
        <div className="transition-crop col-md-10" style={{ "minHeight": this.props.height }}>
          <TransitionGroup transitionName="transition">
            <div className="well printable-content" key={name}>
              <RouteHandler />
            </div>
          </TransitionGroup>
        </div>
      </Row>
      </div>
    );
  }
};

const FullHeightLayout = makeFullHeight(UserLayout, () => {
  let height = window.innerHeight;
  let navbarHeight = document.getElementsByClassName("content-wrapper")[0].getBoundingClientRect().top;
  let footerHeight = document.getElementsByClassName("footer")[0].offsetHeight;
  return height - navbarHeight - footerHeight;
});

const ConnectedLayout = connectToStore(FullHeightLayout, {
  auth: store => ({
    user: store.getAuthenticatedUser(),
  })
});

ConnectedLayout.willTransitionTo = function(transition) {
  if (!transition.context.flux.getStore("auth").getAuthenticatedUser()) {
    transition.redirect("signin");
  }
};

export default ConnectedLayout;
