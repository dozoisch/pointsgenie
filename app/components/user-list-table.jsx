import React, { PropTypes } from "react";
import { Link } from "react-router/build/npm/lib";
import { Table, Glyphicon, ModalTrigger } from "react-bootstrap";

import PointsLogModal from "./points-log-modal";

const ComponentUserListTable = React.createClass({
  displayName: "ComponentUserListTable",

  propTypes: {
    onSortClick: PropTypes.func.isRequired,
    users: PropTypes.array,
    renderLinks: PropTypes.func,
  },

  getDefaultProps() {
    return {
      renderLinks: () => {},
    };
  },

  renderUserPointsLink(user) {
    let modal = (<PointsLogModal user={user} />);
    return (
      <ModalTrigger modal={modal}>
        <a href="#" onClick={(e) => e.preventDefault()}>{user.totalPoints}</a>
      </ModalTrigger>
    );
  },

  renderUserList() {
    if(this.props.users.length === 0) {
      return (<tr key="emptyTable"><td colSpan="6">Aucun Usager</td></tr>);
    } else {
      return this.props.users.map((user) => {
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
              {this.props.renderLinks(user)}
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
