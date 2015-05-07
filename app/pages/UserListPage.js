import React from "react";
import { Link } from "react-router/build/npm/lib";
import { Table, Glyphicon, ModalTrigger } from "react-bootstrap";
import { sortByOrder as _sortByOrder } from "lodash";

import UserStore from "../stores/user";

import UserTable from "../components/user-list-table";
import SearchBar from "../components/utils/search-bar";
import AwardPointsModal from "../components/award-points-modal";

const UserListPage = React.createClass({
  displayName: "UserListPage",

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
        <h3>Usagers</h3>
        <SearchBar ref="searchBar" filterText={this.state.filterText} onChange={this.handleFilterChange} />
        <UserTable users={this.getFilteredUsers()}
          orderBy={this.state.orderBy} ascending={this.state.ascending}
          onSortClick={this.handleSortClick}
         />
      </div>
    );
  },

});

export default UserListPage;

