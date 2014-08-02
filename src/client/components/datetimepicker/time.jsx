/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Glyphicon = require("react-bootstrap/Glyphicon");
var Input = require("react-bootstrap/Input");

var SpinnerInput = require("./spinner-input");

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

  render: function () {
    return (
      <Input wrapperClassName="wrapper">
        <SpinnerInput type="text" placeholder="00" ref="hours" groupClassName="timepicker-hours"
          onUpClick={this.handleUpClick} onDownClick={this.handleDownClick} />
        <SpinnerInput type="text" placeholder="00" ref="mins" groupClassName="timepicker-mins"
          onUpClick={this.handleUpClick} onDownClick={this.handleDownClick} />
        <SpinnerInput type="text" placeholder="AM" ref="meridian" groupClassName="timepicker-meridian"
          onUpClick={this.handleUpClick} onDownClick={this.handleDownClick} />
      </Input>
    );
  }
});
