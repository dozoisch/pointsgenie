/** @jsx React.DOM */
"use strict";
var React = require("react");
var Promocard = require("../components/promocard");
var GeneralInfo = require("../components/general-info");
var PasswordChange = require("../components/password-change");

var request = require("../middlewares/request");

module.exports = React.createClass({
  displayName: "ProfilePage",
  getInitialState: function () {
    return { user: {} };
  },
  componentDidMount: function() {
    request.get("/users/me", function (err, res) {
      if (err || res.status !== 200) return; // @TODO error handling
      var user = res.body.user;
      if (user && user.promocard && user.promocard.date) {
        user.promocard.date = new Date(user.promocard.date);
      }
      this.setState({ user: user });
    }.bind(this));
  },
  getGeneralInfos: function () {
    return { name: this.state.user.name, cip: this.state.user.cip, email: this.state.user.email };
  },
  render: function () {
    return (
      <div className="user-info">
        <h3>Profil</h3>
        <GeneralInfo infos={this.getGeneralInfos()} />
        <PasswordChange hasPassword={this.state.user.hasPassword} />
        <Promocard promocard={this.state.user.promocard} />
      </div>
    );
  }
});
