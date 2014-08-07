/** @jsx React.DOM */
"use strict";
var React = window.React = require("react");
var ReactRouter = require("react-router");
var Route = ReactRouter.Route;
var Routes = ReactRouter.Routes;
var Link = ReactRouter.Link;

var EventsPage = require("./pages-admin/event-list");
var EventPage = require("./pages-admin/event");

var container = document.getElementById("page-container");

var AdminApp = React.createClass({
  displayName: "AdminApplication",
  render: function () {
    return (
      <div className="row" >
        <nav className="col-md-2" role="navigation">
          <h3>Administration</h3>
          <ul className="nav nav-pills nav-stacked">
            <li><Link to="list-events">Événements</Link></li>
            <li><Link to="create-event">Créer un événement</Link></li>
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
  <Routes>
    <Route handler={AdminApp}>
      <Route name="create-event" path="/events/new" handler={EventPage} />
      <Route name="list-events" path="/" handler={EventsPage} >
        <Route name="edit-event" path="/events/:id" handler={EventPage} />
      </Route>
    </Route>
  </Routes>
, container);
