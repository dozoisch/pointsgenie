import React from "react";
import Router, { Route, DefaultRoute } from "react-router";

import Application from "./applications/user";

import IndexPage from "./pages/index";
import ProfilePage from "./pages/profile";
import FAQPage from "./pages/faq";

require("./less/main.less");

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
