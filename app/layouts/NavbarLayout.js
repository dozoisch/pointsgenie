import React, { PropTypes } from "react";

import connectToStore from "flummox/connect";

import { Link } from "react-router/build/npm/lib";

import { Navbar, Nav, Glyphicon } from "react-bootstrap";
import { NavItemLink } from "react-router-bootstrap";

const NavbarLayout = React.createClass({
  displayName: "NavbarLayout",

  propTypes: {
    username: PropTypes.string,
  },

  render() {
    const faq = this.props.user ? "faq" : "a-faq";
    return (
      <Navbar brand={this.renderBrand()} toggleNavKey="0" className="main-navbar" inverse fixedTop>
        <Nav navbar collapsible={true} expanded={false} eventKey="0" right>
          <NavItemLink to={faq}><Glyphicon glyph="pushpin"/> FAQ</NavItemLink>
          {this.renderAuthenticatedLinks()}
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

  renderAuthenticatedLinks() {
    const username = this.props.user ? this.props.user.name : "";
    if (!username) {
      return null;
    }
    return [
      (<NavItemLink key="profile" to="profile"><Glyphicon glyph="user"/> {username}</NavItemLink>),
      (<li key="admin"><a href="/admin#/"><Glyphicon glyph="star" /> Admin</a></li>),
      (<NavItemLink key="sginout" to="signout"><Glyphicon glyph="off"/> Déconnexion</NavItemLink>),
    ];
  },
});

const ConnectedNavbar = connectToStore(NavbarLayout, {
  auth: store => ({
    user: store.getAuthenticatedUser(),
  })
});

export default ConnectedNavbar;
