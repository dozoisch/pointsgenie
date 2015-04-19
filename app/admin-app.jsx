"use strict";
var React = require("react");
var ReactRouter = require("react-router");
var Route = ReactRouter.Route;
var Routes = ReactRouter.Routes;
var Link = ReactRouter.Link;

var EventsPage = require("./pages-admin/event-list");
var EventPage = require("./pages-admin/event");
var MatchToEventPage = require("./pages-admin/match-to-event");
var SchedulePage = require("./pages-admin/event-schedule");
var AttributionPage = require("./pages-admin/event-points-attribution");
var PromocardPage = require("./pages-admin/promocard");
var UsersPage = require("./pages-admin/user-list");

if (typeof window != "undefined") {
  window.React = React;
}

require("./less/main.less");

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
            <li><Link to="promocard">Attribuer une promocarte</Link></li>
            <li><Link to="list-users">Usagers</Link></li>
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
    <Route handler={AdminApp}>
      <Route name="create-event" path="/events/new" handler={EventPage} />
      <Route name="list-events" path="/" handler={EventsPage} >
        <Route name="edit-event" path="/events/:id" handler={EventPage} />
        <Route name="match-to-event" path="/events/:id/match" handler={MatchToEventPage} />
        <Route name="event-schedule" path="/events/:id/schedule" handler={SchedulePage} />
        <Route name="event-attribution" path="/events/:id/attribute" handler={AttributionPage} />
      </Route>
      <Route name="promocard" path="/promocard" handler={PromocardPage} />
      <Route name="list-users" path="/users" handler={UsersPage} />
    </Route>
  </Routes>
, container);
