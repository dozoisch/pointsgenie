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
  },
  renderMakeAdminLink: function (user) {
    if (user.isAdmin) {
      return null;
    } else {
      var boundOnClick = this.props.onMakeAdminClick.bind(this, user.uid);
      return (<a href="#" onClick={boundOnClick}>Rendre admin</a>);
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
            <td>{ user.isAdmin ? <Glyphicon glyph="star" title="Administrateur" /> : null }</td>
            <td>{ this.renderMakeAdminLink(user) }</td>
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
            <th>Rôle</th>
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
