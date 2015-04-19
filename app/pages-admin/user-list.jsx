"use strict";
import React from "react";
import { Link } from "react-router";
import { Table, Glyphicon } from "react-bootstrap";

import UserStore from "../stores/user";

import UserTable from "../components/user-list-table";
import SearchBar from "../components/utils/search-bar";

const AdminUserList = React.createClass({
  displayName: "AdminUserList",

  getInitialState() {
    return {
      users: UserStore.getUsers(),
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

  handleAssignPromocardClick (cip, e) {
    e.preventDefault();
    if (confirm("Êtes-vous sûr de vouloir attribuer une promocarte a " + cip + "?")) {
      UserStore.assignPromocard(cip);
    }
  },

  handleMakeAdminClick (id, e) {
    e.preventDefault();
    let user = UserStore.getUser(id);
    if (confirm("Êtes-vous sûr de promouvoir " + user.name + " comme administrateur?")) {
      UserStore.makeAdmin(id);
    }
  },

  handleAwardPointsSubmit (id, data, e) {
    e.preventDefault();
    let user = UserStore.getUser(id);
    UserStore.awardPoints(id, data);
  },

  handleFilterChange () {
    this.setState({ filterText: this.refs.searchBar.getValue()});
  },

  getFilteredUsers () {
    if (!this.state.users) {
      return [];
    }
    if (!this.state.filterText || this.state.filterText.trim() === "") {
      return this.state.users;
    } else {
      return this.state.users.filter(function (user) {
        // @TODO export that function
        let escapedInput = this.state.filterText.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|\s]/g, "");
        let filterRegex = new RegExp(escapedInput.split("").join(".*"), "i");
        return filterRegex.test(user.cip || "") ||
          filterRegex.test(user.name || "") ||
          filterRegex.test(user.email || "");
      }, this);
    }
  },

  render() {
    return (
      <div className="user-list">
        <h3>Usagers</h3>
        <SearchBar ref="searchBar" filterText={this.state.filterText} onChange={this.handleFilterChange} />
        <UserTable users={this.getFilteredUsers()}
          onFetchProfileClick={this.handleFetchProfileClick}
          onMakeAdminClick={this.handleMakeAdminClick}
          onAssignPromocardClick={this.handleAssignPromocardClick}
          onAwardPointsSubmit={this.handleAwardPointsSubmit} />
      </div>
    );
  }
});

export default AdminUserList;
