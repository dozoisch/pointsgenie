/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Link = require("react-router").Link;

var Table = require("react-bootstrap/Table");
var Glyphicon = require("react-bootstrap/Glyphicon");
var ModalTrigger = require("react-bootstrap/ModalTrigger");

var AwardPointsModal = require("./award-points-modal");
var PointsLogModal = require("./points-log-modal");

module.exports = React.createClass({
  displayName: "ComponentUserListTable",
  propTypes: {
    users: PropTypes.array,
    onMakeAdminClick: PropTypes.func.isRequired,
    onAssignPromocardClick: PropTypes.func.isRequired,
    onAwardPointsSubmit: PropTypes.func.isRequired,
  },
  handleMakeAdminClick: function (id, e) {
    this.props.onMakeAdminClick(id, e);
  },
  handleAssignPromocardLink: function (cip, e) {
    this.props.onAssignPromocardClick(cip, e);
  },
  renderMakeAdminLink: function (user) {
    if (user.isAdmin) {
      return null;
    } else {
      var boundOnClick = this.handleMakeAdminClick.bind(this, user.id);
      return (<li><a href="#" onClick={boundOnClick}>Rendre administrateur</a></li>);
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
  renderAwardPointsLink: function (user) {
    if (user.promocard && user.promocard.date) {
      var modal = (<AwardPointsModal user={user} onFormSubmit={this.props.onAwardPointsSubmit} />);
      return (
        <li>
          <ModalTrigger modal={modal}>
            <a href="#" onClick={preventDefaultClick}>Attribuer des points</a>
          </ModalTrigger>
        </li>
      );
    } else {
      return null;
    }
  },
  renderUserPointsLink: function (user) {
    var modal = (<PointsLogModal user={user} />);
    return (
      <ModalTrigger modal={modal}>
        <a href="#" onClick={preventDefaultClick}>{user.totalPoints}</a>
      </ModalTrigger>
    );
  },
  renderUserList: function () {
    if(this.props.users.length === 0) {
      return (<tr key="emptyTable"><td colSpan="6">Aucun Usager</td></tr>);
    } else {
      return this.props.users.map(function (user) {
        return (
          <tr key={user.id} title={"Créer le " + user.created.toLocaleDateString()}>
            <td>{ user.cip }</td>
            <td>{ user.name }</td>
            <td>{ user.email }</td>
            <td>{ this.renderUserPointsLink(user) }</td>
            <td>
              { user.promocard && user.promocard.date ?
                <Glyphicon glyph="credit-card" title="Possède une promocarte" /> : null }
              { user.isAdmin ? <Glyphicon glyph="star" title="Est administrateur" /> : null }
            </td>
            <td>
              <ul>
                { this.renderAssignPromocardLink(user) }
                { this.renderAwardPointsLink(user) }
                { this.renderMakeAdminLink(user) }
              </ul>
            </td>
          </tr>
        );
      }, this);
    }
  },
  render: function() {
    return (
      <Table bordered hover responsive striped>
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

function preventDefaultClick (e) {
  e.preventDefault();
}
