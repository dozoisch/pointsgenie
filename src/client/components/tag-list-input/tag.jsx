/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Label = require("react-bootstrap/Label");
var Glyphicon = require("react-bootstrap/Glyphicon");

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
