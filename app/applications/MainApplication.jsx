import React, { Component, PropTypes } from "react";
import TransitionGroup from "react/lib/ReactCSSTransitionGroup";
import { RouteHandler, Link } from "react-router/build/npm/lib";

import NavBar from "../layouts/NavbarLayout";

class MainApplication extends Component {
  static displayName = "MainApplication";

  render() {
    return (
      <div>
        <NavBar/>
        <RouteHandler />
      </div>
    );
  }
};

export default MainApplication;
