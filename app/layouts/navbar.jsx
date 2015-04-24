import React from "react";

import { Link } from "react-router";

import { Navbar, Nav, Glyphicon } from "react-bootstrap";
import { NavItemLink } from "react-router-bootstrap";

const NavBar = React.createClass({
  displayName: "NavBar",

  render() {
    return (
      <Navbar brand={this.renderBrand()} toggleNavKey="0" className="main-navbar" inverse fixedTop>
        <Nav navbar collapsable={true} expanded={false} eventKey="0" right>
          <NavItemLink to="faq"><Glyphicon glyph="pushpin"/> FAQ</NavItemLink>
          <NavItemLink to="profile"><Glyphicon glyph="user"/> {this.props.username}</NavItemLink>
          <li><a href="/admin#/"><Glyphicon glyph="star" /> Admin</a></li>
          <NavItemLink to="signout"><Glyphicon glyph="off"/> Déconnexion</NavItemLink>
        </Nav>
      </Navbar>
    );
  },

  renderBrand() {
    return (
      <Link to="index">
        <span className="eng57logo"></span>
        Site des points génie
      </Link>
    );
  },
});

export default NavBar;
