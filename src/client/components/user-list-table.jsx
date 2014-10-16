/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Link = require("react-router").Link;
var Table = require("react-bootstrap/Table");
var Glyphicon = require("react-bootstrap/Glyphicon");


module.exports = React.createClass({
  displayName: "ComponentUserListTable",
  propTypes: {
    users: PropTypes.array,
    onMakeAdminClick: PropTypes.func.isRequired,
    onAssignPromocardClick: PropTypes.func.isRequired,
  },
  handleMakeAdminClick: function(uid, e) {
    this.props.onMakeAdminClick(uid, e);
  },
  handleAssignPromocardLink: function(cip, e) {
    this.props.onAssignPromocardClick(cip, e);
  },
  renderMakeAdminLink: function (user) {
    if (user.isAdmin) {
      return null;
    } else {
      var boundOnClick = this.handleMakeAdminClick.bind(this, user.uid);
      return (<li><a href="#" onClick={boundOnClick}>Rendre admin</a></li>);
    }
  },
  renderAssignPromocardLink: function (user) {
    if (user.promocard && user.promocard.date) {
      return null;
    } else {
      var boundOnClick = this.handleAssignPromocardLink.bind(this, user.cip);
      return (<li><a href="#" onClick={boundOnClick}>Attribuer une promocarte</a></li>);
    }
  },
  renderUserList: function () {
    if(this.props.users.length === 0) {
      return (<tr key="emptyTable"><td colSpan="6">Aucun Usager</td></tr>);
    } else {
      return this.props.users.map(function (user) {
        return (
          <tr key={user.uid} title={"Créer le " + user.created.toLocaleDateString()}>
            <td>{ user.cip }</td>
            <td>{ user.name }</td>
            <td>{ user.email }</td>
            <td>{ user.totalPoints }</td>
            <td>
              { user.promocard && user.promocard.date ?
                <Glyphicon glyph="credit-card" title="Possède une promocarte" /> : null }
              { user.isAdmin ? <Glyphicon glyph="star" title="Est administrateur" /> : null }
            </td>
            <td>
              <ul>
                { this.renderMakeAdminLink(user) }
                { this.renderAssignPromocardLink(user) }
              </ul>
            </td>
          </tr>
        );
      }, this);
    }
  },
  render: function() {
    return (
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Cip</th>
            <th>Nom</th>
            <th>Courriel</th>
            <th>Points</th>
            <th></th>
            <th>{/* Actions */}</th>
          </tr>
        </thead>
        <tbody>
          {this.renderUserList()}
        </tbody>
      </Table>
    );
  }
});
