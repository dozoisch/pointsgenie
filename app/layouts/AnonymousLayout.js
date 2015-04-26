import React from "react";
import { Link, RouteHandler } from "react-router/build/npm/lib";

import { Jumbotron, Nav, Row, Col } from "react-bootstrap";

const AnonymousLayout = React.createClass({
  displayName: "AnonymousLayout",
  render() {
    return (
      <Jumbotron>
        <div className="container">
          <RouteHandler />
        </div>
      </Jumbotron>
    );
  }
});

export default AnonymousLayout;
