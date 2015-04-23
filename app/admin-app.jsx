"use strict";
import React from "react";

import Router, { Route, DefaultRoute } from "react-router";

import AdminApplication from "./applications/admin";

import EventsPage from "./pages-admin/event-list";
import EventPage from "./pages-admin/event";
import MatchToEventPage from "./pages-admin/match-to-event";
import SchedulePage from "./pages-admin/event-schedule";
import AttributionPage from "./pages-admin/event-points-attribution";
import PromocardPage from "./pages-admin/promocard";
import UsersPage from "./pages-admin/user-list";

require("./less/main.less");

const routes = (
  <Route handler={AdminApplication}>
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

