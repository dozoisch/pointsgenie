/** @jsx React.DOM */
"use strict";
var React = window.React = require("react");
var reactNestedRouter = require("react-nested-router");
var Route = reactNestedRouter.Route;
var Link = reactNestedRouter.Link;

var container = document.getElementById("page-container");

var AdminApp = React.createClass({
  displayName: "AdminApplication",
  render: function () {
    return (
      <div className="row" >
        <nav className="col-md-2" role="navigation">
          <h3>Administration</h3>
          <ul className="nav nav-pills nav-stacked">
            <li><Link >Créer un événement</Link></li>
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
  <Route handler={AdminApp} >
  </Route>
, container);
