/** @jsx React.DOM */
"use strict";
var React = require("react");
var ReactRouter = require("react-router");
var Route = ReactRouter.Route;
var Routes = ReactRouter.Routes;
var Link = ReactRouter.Link;

var IndexPage = require("./pages/index");
var ProfilePage = require("./pages/profile");
var FAQPage = require("./pages/faq");

if (typeof window !== "undefined") {
  window.React = React;
}

var container = document.getElementById("page-container");

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
          {this.props.activeRouteHandler()}
        </div>
      </div>
    );
  }
});

React.renderComponent(
  <Routes>
    <Route handler={App}>
      <Route name="index" path="/" handler={IndexPage} />
      <Route name="profile" path="profile" handler={ProfilePage} />
      <Route name="faq" path="faq" handler={FAQPage} />
    </Route>
  </Routes>
, container);
