"use strict";
import React, { PropTypes } from "react";
import TransitionGroup from "react/lib/ReactCSSTransitionGroup";
import { RouteHandler, Link } from "react-router";

import makeFullHeight from "../composition/full-height";

const Application = React.createClass({
  displayName: "Application",

  contextTypes: {
    router: PropTypes.func
  },

  getInitialState() {
    return {
      height: 0,
    };
  },

  render: function () {
    let name = this.context.router.getCurrentPath();
    return (
      <div className="row" >
        <nav className="col-md-2" role="navigation">
          <h3>Liens</h3>
          <ul className="nav nav-pills nav-stacked" >
            <li><Link to="index">Accueil</Link></li>
            <li><Link to="profile">Profil</Link></li>
            <li><Link to="faq">FAQ</Link></li>
          </ul>
        </nav>
        <div className="transition-crop col-md-10" style={{ "minHeight": this.props.height }}>
          <TransitionGroup transitionName="transition">
            <div className="well printable-content" key={name}>
              <RouteHandler />
            </div>
          </TransitionGroup>
        </div>
      </div>
    );
  }
});

const FullHeightApplication = makeFullHeight(Application, () => {
  let height = window.innerHeight;
  let navbarHeight = document.getElementsByClassName("content-wrapper")[0].getBoundingClientRect().top;
  let footerHeight = document.getElementsByClassName("footer")[0].offsetHeight;
  return height - navbarHeight - footerHeight;
});

export default FullHeightApplication;
