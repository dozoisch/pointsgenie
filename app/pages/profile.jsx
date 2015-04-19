"use strict";
import React from "react";

import Promocard from "../components/promocard";
import GeneralInfo from "../components/general-info";
import PasswordChange from "../components/password-change";

import request from "../middlewares/request";

const ProfilePage = React.createClass({
  displayName: "ProfilePage",

  getInitialState() {
    return { user: {} };
  },

  componentDidMount() {
    request.get("/users/me", (err, res) => {
      if (err || res.status !== 200) return; // @TODO error handling
      var user = res.body.user;
      if (user && user.promocard && user.promocard.date) {
        user.promocard.date = new Date(user.promocard.date);
      }
      this.setState({ user: user });
    });
  },

  getGeneralInfos() {
    return { name: this.state.user.name, cip: this.state.user.cip, email: this.state.user.email };
  },

  render() {
    return (
      <div className="user-info">
        <h3>Profil</h3>
        <GeneralInfo infos={this.getGeneralInfos()} />
        <PasswordChange hasPassword={this.state.user.hasPassword} />
        <Promocard promocard={this.state.user.promocard} />
      </div>
    );
  },
});

export default ProfilePage;
