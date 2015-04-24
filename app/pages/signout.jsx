import React, { PropTypes } from "react";
import AuthApi from "../api/auth";

const authApi = new AuthApi();

const SignOut = React.createClass({
  displayName: "SignOut",

  contextTypes: {
    router: React.PropTypes.func
  },

  componentWillMount() {
    authApi.signOut(() => {
      this.context.router.replaceWith("index");
    });
  },

  render() {
    return null;
  },

});

export default SignOut;
