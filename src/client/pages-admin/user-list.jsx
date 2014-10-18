/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Link = require("react-router").Link;
var Table = require("react-bootstrap/Table");
var Glyphicon = require("react-bootstrap/Glyphicon");

var UserStore = require("../stores/user");

var UserTable = require("../components/user-list-table");
var SearchBar = require("../components/utils/search-bar");

module.exports = React.createClass({
  displayName: "AdminUserList",
  getInitialState: function() {
    return {
      users: UserStore.getUsers(),
    };
  },
  componentWillMount: function () {
    UserStore.init();
  },
  componentDidMount: function () {
    UserStore.addChangeListener(this.updateUsers);
  },
  componentWillUnmount: function() {
    UserStore.removeChangeListener(this.updateUsers);
  },
  updateUsers: function () {
    if(!this.isMounted()) {
      return;
    }
    this.setState({
      users: UserStore.getUsers(),
    });
  },
  handleAssignPromocardClick: function (cip, e) {
    e.preventDefault();
    if (confirm("Êtes-vous sûr de vouloir attribuer une promocarte a " + cip + "?")) {
      UserStore.assignPromocard(cip);
    }
  },
  handleMakeAdminClick: function (id, e) {
    e.preventDefault();
    var user = UserStore.getUser(id);
    if (confirm("Êtes-vous sûr de promouvoir " + user.name + " comme administrateur?")) {
      UserStore.makeAdmin(id);
    }
  },
  handleAwardPointsSubmit: function (id, data, e) {
    e.preventDefault();
    var user = UserStore.getUser(id);
    UserStore.awardPoints(id, data);
  },
  handleFilterChange: function () {
    this.setState({ filterText: this.refs.searchBar.getValue()});
  },
  getFilteredUsers: function () {
    if (!this.state.users) {
      return [];
    }
    if (!this.state.filterText || this.state.filterText.trim() === "") {
      return this.state.users;
    } else {
      return this.state.users.filter(function (user) {
        // @TODO export that function
        var lowerCaseFilterText = this.state.filterText.trim().toUpperCase().replace(/\s+/g, "").split("").join(".*");
        return user.cip.toUpperCase().match(lowerCaseFilterText) ||
          user.name.toUpperCase().match(lowerCaseFilterText) ||
          user.email.toUpperCase().match(lowerCaseFilterText);
      }, this);
    }
  },
  render: function() {
    return (
      <div className="user-list">
        <h3>Usagers</h3>
        <SearchBar ref="searchBar" filterText={this.state.filterText} onChange={this.handleFilterChange} />
        <UserTable users={this.getFilteredUsers()}
          onMakeAdminClick={this.handleMakeAdminClick} onAssignPromocardClick={this.handleAssignPromocardClick}
          onAwardPointsSubmit={this.handleAwardPointsSubmit} />
      </div>
    );
  }
});
