/** @jsx React.DOM */
"use strict";
var React = window.React = require("react");
var reactNestedRouter = require("react-nested-router");
var Route = reactNestedRouter.Route;
var Link = reactNestedRouter.Link;

var IndexPage = require("./pages/index");
var ProfilePage = require("./pages/profile");

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
          </ul>
        </nav>
        <div className="col-md-10 well">
          {this.props.activeRouteHandler()}
        </div>
      </div>
    );
  }
});

React.renderComponent(
  <Route handler={App} >
    <Route name="index" path="/" handler={IndexPage} />
    <Route name="profile" path="profile" handler={ProfilePage} />
  </Route>
, container);


