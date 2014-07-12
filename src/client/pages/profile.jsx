/** @jsx React.DOM */
"use strict";
var React = require("react");
var Promocard = require("../components/promocard");
var GeneralInfo = require("../components/general_info");
var PasswordChange = require("../components/password_change");

var request = require("../middlewares/request");

module.exports = React.createClass({
  getInitialState: function () {
    return { user: {promocard: {}} };
  },
  componentDidMount: function() {
    request.get("/user/me", function (res) {
      if (res.status !== 200) return;
      this.setState({user: res.body.user});
    }.bind(this));
  },
  getGeneralInfos: function () {
    return { name: this.state.user.name, cip: this.state.user.cip, email: this.state.user.email };
  },
  render: function () {
    return (
      <div className="user-info">
        <GeneralInfo infos={this.getGeneralInfos()} />
        <PasswordChange hasPassword={this.state.user.hasPassword} />
        <Promocard promocard={this.state.user.promocard} />
      </div>
    );
  }
});
