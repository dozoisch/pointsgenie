"use strict";
var React = require("react");
import Router, { RouteHandler, Link, Route, DefaultRoute } from "react-router";

var IndexPage = require("./pages/index");
var ProfilePage = require("./pages/profile");
var FAQPage = require("./pages/faq");

if (typeof window !== "undefined") {
  window.React = React;
}

require("./less/main.less");

var App = React.createClass({
  displayName: "Application",
  render: function () {
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
        <div className="col-md-10 well printable-content">
          <RouteHandler />
        </div>
      </div>
    );
  }
});

var routes = (
  <Route handler={App}>
    <DefaultRoute name="index" handler={IndexPage} />
    <Route name="profile" path="profile" handler={ProfilePage} />
    <Route name="faq" path="faq" handler={FAQPage} />
  </Route>
);

Router.run(routes, Router.HashLocation, function (Handler) {
  React.render(<Handler/>,  document.getElementById("page-container"));
});
