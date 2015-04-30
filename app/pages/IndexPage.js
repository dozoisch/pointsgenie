import React, { PropTypes } from "react";

import PointsLog from "../components/PointsLog";
import ApplyToEvent from "../components/ApplyToEvent";
import connectToStore from "flummox/connect";

const IndexPage = React.createClass({
  displayName: "IndexPage",

  propTypes: {
    user: PropTypes.object,
  },

  render() {
    const user = this.props.user || {};
    return (
      <div className="index-page">
        <ApplyToEvent promocard={user.promocard} />
        <PointsLog log={user.points} />
      </div>
    );
  }
});

const ConnectedIndex = connectToStore(IndexPage, {
  auth: store => ({
    user: store.getAuthenticatedUser(),
  })
});

export default ConnectedIndex;
