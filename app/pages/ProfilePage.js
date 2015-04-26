"use strict";
import React from "react";

import Promocard from "../components/promocard";
import GeneralInfo from "../components/general-info";
import PasswordChange from "../components/password-change";
import connectToStore from "flummox/connect";

import request from "../middlewares/request";

const ProfilePage = React.createClass({
  displayName: "ProfilePage",

  render() {
    const user = this.props.user || {};
    return (
      <div className="user-info">
        <h3>Profil</h3>
        <GeneralInfo infos={user} />
        <PasswordChange hasPassword={user.hasPassword} />
        <Promocard promocard={user.promocard} />
      </div>
    );
  },
});

const ConnectedProfile = connectToStore(ProfilePage, {
  auth: store => ({
    user: store.getAuthenticatedUser(),
  })
});

export default ConnectedProfile;
