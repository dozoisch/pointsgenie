import React, { PropTypes } from "react";
import TransitionGroup from "react/lib/ReactCSSTransitionGroup";

import { RouteHandler } from "react-router";

import { Nav, Row, Col } from "react-bootstrap";

import { NavItemLink } from "react-router-bootstrap";

import makeFullHeight from "../composition/full-height";

const MainLayout = React.createClass({
  displayName: "MainLayout",

  contextTypes: {
    router: PropTypes.func,
  },

  render() {
    let name = this.context.router.getCurrentPath();
    return (
      <div className="container content-wrapper">
      <Row>
        <Col md={2} role="navigation">
          <h3>Liens</h3>
          <Nav bsStyle="pills" stacked>
            <NavItemLink to="index">Accueil</NavItemLink>
            <NavItemLink to="profile">Profil</NavItemLink>
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
  },
});

const FullHeightLayout = makeFullHeight(MainLayout, () => {
  let height = window.innerHeight;
  let navbarHeight = document.getElementsByClassName("content-wrapper")[0].getBoundingClientRect().top;
  let footerHeight = document.getElementsByClassName("footer")[0].offsetHeight;
  return height - navbarHeight - footerHeight;
});

export default FullHeightLayout;
