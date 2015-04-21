"use strict";
import React, { PropTypes } from "react";
import TransitionGroup from "react/lib/ReactCSSTransitionGroup";
import Router, { RouteHandler, Link, Route, DefaultRoute } from "react-router";

import IndexPage from "./pages/index";
import ProfilePage from "./pages/profile";
import FAQPage from "./pages/faq";

require("./less/main.less");

const Application = React.createClass({
  displayName: "Application",

  contextTypes: {
    router: PropTypes.func
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
        <div className="transition-crop col-md-10">
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

const routes = (
  <Route handler={Application}>
    <DefaultRoute name="index" handler={IndexPage} />
    <Route name="profile" path="profile" handler={ProfilePage} />
    <Route name="faq" path="faq" handler={FAQPage} />
  </Route>
);

Router.run(routes, Router.HashLocation, function (Handler) {
  React.render(<Handler/>,  document.getElementById("page-container"));
});
