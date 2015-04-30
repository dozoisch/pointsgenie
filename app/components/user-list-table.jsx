import React, { PropTypes } from "react";
import { Link } from "react-router/build/npm/lib";
import { Table, Glyphicon, ModalTrigger } from "react-bootstrap";

import AwardPointsModal from "./award-points-modal";
import PointsLogModal from "./points-log-modal";

function preventDefaultClick (e) {
  e.preventDefault();
}

const ComponentUserListTable = React.createClass({
  displayName: "ComponentUserListTable",

  propTypes: {
    users: PropTypes.array,
    onSortClick: PropTypes.func.isRequired,
    onMakeAdminClick: PropTypes.func.isRequired,
    onAssignPromocardClick: PropTypes.func.isRequired,
    onFetchProfileClick: PropTypes.func.isRequired,
    onAwardPointsSubmit: PropTypes.func.isRequired,
  },

  handleFetchProfileClick(id, e) {
    this.props.onFetchProfileClick(id, e);
  },

  handleMakeAdminClick(id, e) {
    this.props.onMakeAdminClick(id, e);
  },

  handleAssignPromocardClick(cip, e) {
    this.props.onAssignPromocardClick(cip, e);
  },

  renderFetchProfileLink(user) {
    if (user.name && user.email) {
      return null;
    } else {
      const boundOnClick = this.handleFetchProfileClick.bind(this, user.id);
      return (<li><a href="#" onClick={boundOnClick}>Compléter le profile</a></li>);
    }
  },

  renderMakeAdminLink(user) {
    if (user.isAdmin) {
      return null;
    } else {
      const boundOnClick = this.handleMakeAdminClick.bind(this, user.id);
      return (<li><a href="#" onClick={boundOnClick}>Rendre administrateur</a></li>);
    }
  },

  renderAssignPromocardLink(user) {
    if (user.promocard && user.promocard.date) {
      return null;
    } else {
      const boundOnClick = this.handleAssignPromocardClick.bind(this, user.cip);
      return (<li><a href="#" onClick={boundOnClick}>Attribuer une promocarte</a></li>);
    }
  },

  renderAwardPointsLink(user) {
    if (user.promocard && user.promocard.date) {
      let modal = (<AwardPointsModal user={user} onFormSubmit={this.props.onAwardPointsSubmit} />);
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

  renderUserPointsLink(user) {
    let modal = (<PointsLogModal user={user} />);
    return (
      <ModalTrigger modal={modal}>
        <a href="#" onClick={preventDefaultClick}>{user.totalPoints}</a>
      </ModalTrigger>
    );
  },


  renderUserList() {
    if(this.props.users.length === 0) {
      return (<tr key="emptyTable"><td colSpan="6">Aucun Usager</td></tr>);
    } else {
      return this.props.users.map((user) => {
        console.log(user.created, user);
        // if (!user.created instanceof Date) {
          // user.created = new Date(user.created);
        // }
        return (
          <tr key={user.id} className={user.isAdmin ? "success": undefined}
            title={`Créer le ${user.created.toLocaleDateString()}`}>
            <td>{user.cip}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{this.renderUserPointsLink(user)}</td>
            <td>
              { user.promocard && user.promocard.date ?
                <Glyphicon glyph="credit-card" title="Possède une promocarte" /> : null }
              { user.isAdmin ? <Glyphicon glyph="star" title="Est administrateur" /> : null }
            </td>
            <td>
              <ul>
                {this.renderFetchProfileLink(user)}
                {this.renderAssignPromocardLink(user)}
                {this.renderAwardPointsLink(user)}
                {this.renderMakeAdminLink(user)}
              </ul>
            </td>
          </tr>
        );
      });
    }
  },

  renderTotalPoints() {
    if (this.props.users.length === 0) {
      return 0;
    } else {
      let totalPoints = 0;
      for (let i = this.props.users.length - 1; i >= 0; i--) {
        totalPoints += this.props.users[i].totalPoints
      }
      return totalPoints;
    }
  },

  renderSortableAnchor(label, key) {
    let onClick = (e) => {
      e.preventDefault();
      return this.props.onSortClick(key);
    }
    let glyph;
    if (key === this.props.orderBy) {
      glyph = (
        <Glyphicon className="pull-right"
          glyph={this.props.ascending ? "sort-by-attributes" : "sort-by-attributes-alt" }/>
      );
    }
    return (<span><a href="#" onClick={onClick}>{label}</a>{glyph}</span>);
  },

  render() {
    return (
      <Table bordered hover responsive striped>
        <thead>
          <tr>
            <th>{this.renderSortableAnchor("Cip", "cip")}</th>
            <th>{this.renderSortableAnchor("Nom", "name")}</th>
            <th>Courriel</th>
            <th>{this.renderSortableAnchor(`Points (${this.renderTotalPoints()})`, "totalPoints")}</th>
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

export default ComponentUserListTable;
