"use strict";
import React, { PropTypes } from "react";
import TransitionGroup from "react/lib/ReactCSSTransitionGroup";
import { RouteHandler, Link } from "react-router";

import NavBar from "../layouts/navbar";

const Application = React.createClass({
  displayName: "Application",

  contextTypes: {
    router: PropTypes.func
  },

  componentDidMount() {
  },

  render() {
    let username = this.props.user ? this.props.user.name : "";
    return (
      <div>
        <NavBar username={username}/>
        <RouteHandler />
      </div>
    );
  }
});

export default Application;
