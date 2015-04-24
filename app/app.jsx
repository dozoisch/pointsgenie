import React from "react";
import Router, { Route, DefaultRoute } from "react-router";

import Application from "./applications/user";

import MainLayout from "./layouts/default";

import IndexPage from "./pages/index";
import ProfilePage from "./pages/profile";
import FAQPage from "./pages/faq";
import SignInPage from "./pages/signin";
import SignOutPage from "./pages/signout";

require("./less/main.less");

const routes = (
  <Route handler={Application}>
    <Route name="home" path="/" handler={MainLayout}>
      <DefaultRoute name="index" handler={IndexPage} />
      <Route name="profile" path="profile" handler={ProfilePage} />
      <Route name="faq" path="faq" handler={FAQPage} />
    </Route>
    <Route name="signout" path="logout" handler={SignOutPage} />
  </Route>
);

let bootstrap;
if (typeof window !== undefined && window.DATA) {
  bootstrap = JSON.parse(window.DATA);
}

Router.run(routes, Router.HashLocation, function (Handler) {
  React.render(
    <Handler {...bootstrap}/>,
    document.getElementById("page-container")
  );
});
