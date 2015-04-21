"use strict";
import React, { PropTypes } from "react";
import TransitionGroup from "react/lib/ReactCSSTransitionGroup";

import Router, { RouteHandler, Link, Route, DefaultRoute } from "react-router";

import EventsPage from "./pages-admin/event-list";
import EventPage from "./pages-admin/event";
import MatchToEventPage from "./pages-admin/match-to-event";
import SchedulePage from "./pages-admin/event-schedule";
import AttributionPage from "./pages-admin/event-points-attribution";
import PromocardPage from "./pages-admin/promocard";
import UsersPage from "./pages-admin/user-list";

require("./less/main.less");

const AdminApp = React.createClass({
  displayName: "AdminApplication",

  contextTypes: {
    router: PropTypes.func
  },

  getInitialState() {
    return {
      height: 0,
    };
  },

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    this.calculateHeight();
  },

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },

  calculateHeight() {
    let height = window.innerHeight;
    let navbarHeight = document.getElementsByClassName("content-wrapper")[0].getBoundingClientRect().top;
    let footerHeight = document.getElementsByClassName("footer")[0].offsetHeight;
    this.setState({
      height: height - navbarHeight - footerHeight - 1,
    });
  },

  render: function () {
    let name = this.context.router.getCurrentPath();
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
        <div className="transition-crop col-md-10" style={{ "minHeight": this.state.height }}>
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
  <Route handler={AdminApp}>
    <Route name="create-event" path="/events/new" handler={EventPage} />
    <Route name="index" path="/" >
      <DefaultRoute name="list-events" handler={EventsPage} />
      <Route name="edit-event" path="/events/:id" handler={EventPage} />
      <Route name="match-to-event" path="/events/:id/match" handler={MatchToEventPage} />
      <Route name="event-schedule" path="/events/:id/schedule" handler={SchedulePage} />
      <Route name="event-attribution" path="/events/:id/attribute" handler={AttributionPage} />
    </Route>
    <Route name="promocard" path="/promocard" handler={PromocardPage} />
    <Route name="list-users" path="/users" handler={UsersPage} />
  </Route>
);

Router.run(routes, Router.HashLocation, function (Handler) {
  React.render(<Handler/>,  document.getElementById("page-container"));
});

