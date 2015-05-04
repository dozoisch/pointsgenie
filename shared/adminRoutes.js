import React from "react";
import { Route, DefaultRoute } from "react-router/build/npm/lib";

import AdminApplication from "../app/apps/AdminApplication";

import AdminEventListPage from "../app/pages-admin/AdminEventListPage";
import AdminEventPage from "../app/pages-admin/AdminEventPage";
import AdminMatchToEventPage from "../app/pages-admin/AdminMatchToEventPage";
import SchedulePage from "../app/pages-admin/event-schedule";
import AttributionPage from "../app/pages-admin/event-points-attribution";
import PromocardPage from "../app/pages-admin/promocard";
import UsersPage from "../app/pages-admin/user-list";

const adminRoutes = (
  <Route handler={AdminApplication}>
    <Route name="create-event" path="/events/new" handler={AdminEventPage} />
    <Route name="index" path="/">
      <DefaultRoute name="list-events" handler={AdminEventListPage} />
      <Route name="edit-event" path="/events/:id" handler={AdminEventPage} />
      <Route name="match-to-event" path="/events/:id/match" handler={AdminMatchToEventPage} />
      <Route name="event-schedule" path="/events/:id/schedule" handler={SchedulePage} />
      <Route name="event-attribution" path="/events/:id/attribute" handler={AttributionPage} />
    </Route>
    <Route name="promocard" path="/promocard" handler={PromocardPage} />
    <Route name="list-users" path="/users" handler={UsersPage} />
  </Route>
);

export default adminRoutes;
