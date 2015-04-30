import React, { PropTypes } from "react";

const SignOut = React.createClass({
  displayName: "SignOut",

  contextTypes: {
    router: PropTypes.func,
    flux: PropTypes.object
  },

  statics: {
    willTransitionTo(transition) {
      transition.context.flux.getActions("auth").signOut();
      transition.redirect("signin");
    },
  },

  render() {
    return null;
  },
});

export default SignOut;
