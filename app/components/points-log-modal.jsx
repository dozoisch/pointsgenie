"use strict";
import React, { PropTypes } from "react";
import { Modal } from "react-bootstrap"

var PointsLog = require("./points-log");

module.exports = React.createClass({
  displayName: "PointsLogModal",
  propTypes: {
    user: PropTypes.object
  },

  render: function () {
    return this.transferPropsTo(
      <Modal title={this.props.user.name || this.props.user.cip} animation={true}>
        <div className="modal-body">
          <PointsLog log={this.props.user.points} />
        </div>
      </Modal>
    );
  },
});
