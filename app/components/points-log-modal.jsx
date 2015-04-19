"use strict";
import React, { PropTypes } from "react";
import { Modal } from "react-bootstrap"

import PointsLog from "./points-log";

const PointsLogModal = React.createClass({
  displayName: "PointsLogModal",

  propTypes: {
    user: PropTypes.object,
  },

  render() {
    let { user, ...props } = this.props;
    return (
      <Modal {...props} title={user.name || user.cip} animation={true}>
        <div className="modal-body">
          <PointsLog log={user.points} />
        </div>
      </Modal>
    );
  },
});

export default PointsLogModal;
