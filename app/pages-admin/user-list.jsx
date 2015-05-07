import React from "react";
import { Link } from "react-router/build/npm/lib";
import { Table, Glyphicon, ModalTrigger } from "react-bootstrap";
import { sortByOrder as _sortByOrder } from "lodash";

import UserStore from "../stores/user";

import UserTable from "../components/user-list-table";
import SearchBar from "../components/utils/search-bar";
import AwardPointsModal from "../components/award-points-modal";

const AdminUserList = React.createClass({
  displayName: "AdminUserList",

  getInitialState() {
    return {
      users: UserStore.getUsers(),
      orderBy: "totalPoints",
      ascending: false,
    };
  },

  componentWillMount() {
    UserStore.init();
  },

  componentDidMount() {
    UserStore.addChangeListener(this.updateUsers);
  },

  componentWillUnmount() {
    UserStore.removeChangeListener(this.updateUsers);
  },

  updateUsers() {
    if(!this.isMounted()) {
      return;
    }
    this.setState({
      users: UserStore.getUsers(),
    });
  },

  handleFetchProfileClick(id, e) {
    e.preventDefault();
    UserStore.fetchProfile(id);
  },

  handleAssignPromocardClick(cip, e) {
    e.preventDefault();
    if (confirm(`Êtes-vous sûr de vouloir attribuer une promocarte a ${cip}?`)) {
      UserStore.assignPromocard(cip);
    }
  },

  handleMakeAdminClick(id, e) {
    e.preventDefault();
    let user = UserStore.getUser(id);
    if (confirm(`Êtes-vous sûr de promouvoir ${user.name} comme administrateur?`)) {
      UserStore.makeAdmin(id);
    }
  },

  handleAwardPointsSubmit(id, data, e) {
    e.preventDefault();
    let user = UserStore.getUser(id);
    UserStore.awardPoints(id, data);
  },

  handleFilterChange() {
    this.setState({ filterText: this.refs.searchBar.getValue()});
  },

  handleSortClick(orderBy) {
    let ascending = true;
    if (this.state.orderBy === orderBy) {
      ascending = !this.state.ascending;
    }
    this.setState({ orderBy: orderBy, ascending: ascending });
  },

  getFilteredUsers () {
    if (!this.state.users) {
      return [];
    }
    let users = this.state.users;
    if (this.state.filterText && this.state.filterText.trim() !== "") {
      users = this.state.users.filter((user) => {
        // @TODO export that function
        let escapedInput = this.state.filterText.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|\s]/g, "");
        let filterRegex = new RegExp(escapedInput.split("").join(".*"), "i");
        return filterRegex.test(user.cip || "") || filterRegex.test(user.name || "");
      });
    }
    return _sortByOrder(users, ["isAdmin", this.state.orderBy], [false, this.state.ascending]);
  },


  render() {
    return (
      <div className="user-list">
        <h3>Étudiants de la promotion</h3>
        <SearchBar ref="searchBar" filterText={this.state.filterText} onChange={this.handleFilterChange} />
        <UserTable users={this.getFilteredUsers()}
          orderBy={this.state.orderBy} ascending={this.state.ascending}
          onSortClick={this.handleSortClick}
          renderLinks={this.renderLinks}
         />
      </div>
    );
  },

  renderLinks(user) {
    return (
      <ul>
        {this.renderFetchProfileLink(user)}
        {this.renderAssignPromocardLink(user)}
        {this.renderAwardPointsLink(user)}
        {this.renderMakeAdminLink(user)}
      </ul>
    );
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
      let modal = (<AwardPointsModal user={user} onFormSubmit={this.handleAwardPointsSubmit} />);
      return (
        <li>
          <ModalTrigger modal={modal}>
            <a href="#" onClick={(e) => e.preventDefault()}>Attribuer des points</a>
          </ModalTrigger>
        </li>
      );
    } else {
      return null;
    }
  },

});

export default AdminUserList;

