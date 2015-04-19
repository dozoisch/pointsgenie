"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Modal = require("react-bootstrap/Modal");

var PointsLog = require("./points-log");

module.exports = React.createClass({
  displayName: "PointsLogModal",
  propTypes: {
    // user
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
