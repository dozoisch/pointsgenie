"use strict";
import React, { PropTypes } from "react";
import { Label, Glyphicon } from "react-bootstrap";

module.exports = React.createClass({
  displayName: "Tag",
  propTypes: {
    value: PropTypes.string.isRequired,
    key: PropTypes.oneOfType([
      PropTypes.number.isRequired,
      PropTypes.string.isRequired
    ]),
    onRemove: PropTypes.func.isRequired,
  },
  handleRemove : function () {
    this.props.onRemove(this.props.key);
  },
  render: function () {
    return (
      <Label>{this.props.value} <Glyphicon glyph="remove" onClick={this.handleRemove} /></Label>
    );
  }
});
