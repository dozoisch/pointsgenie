/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Input = require("react-bootstrap/Input");
var Button = require("react-bootstrap/Button");
var Glyphicon = require("react-bootstrap/Glyphicon");

module.exports = React.createClass({
  displayName: "TimePicker",
  propTypes: {
    defaultTime: PropTypes.instanceOf(Date),
    minuteStep: PropTypes.number,
  },
  getDefaultProps: function () {
    return {
      minuteStep: 15,
    };
  },
  handleUpClick: function () {
    console.log("up");
  },
  handleDownClick: function () {
    console.log("down");
  },
  renderAddon: function () {
    return (
      <div className="input-group-spinner">
        <Button><Glyphicon glyph="chevron-up"onClick={this.handleUpClick} /></Button>
        <Button><Glyphicon glyph="chevron-down"onClick={this.handleDownClick} /></Button>
      </div>
    );
  },
  render: function () {
    return (
      <Input type="text" addonAfter={this.renderAddon()} wrapAddonAfter={false}  />
    );
  }
});
