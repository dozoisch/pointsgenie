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
    onChange: PropTypes.func.isRequired,
    time: PropTypes.instanceOf(Date),
    minuteClickStep: PropTypes.number,
    disabled: PropTypes.bool,
  },
  getDefaultProps: function () {
    return {
      minuteClickStep: 15,
    };
  },
  getInitialState: function () {
    return this.props.time ?
      this.getStateFromProps(this.props) :
      {
        hours: 0,
        minutes: 0,
        meridian: "AM"
      };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(this.getStateFromProps(nextProps));
  },
  getStateFromProps: function (props) {
    var state = {};
    if (props.time) {
      state.hours = props.time.getHours() % 12;
      state.minutes = props.time.getMinutes();
      state.meridian = props.time.getHours() < 12 ? "AM" : "PM";
    }
    return state;
  },
  getValue: function () {
    return {
      hours: this.state.hours + (this.state.meridian === "PM" ? 12 : 0),
      minutes: this.state.minutes,
    };
  },
  handleHourUpClick: function () {
    this.setState({
      hours: (this.state.hours + 1) % 12
    }, this.props.onChange);
  },
  handleHourDownClick: function () {
    this.setState({
      hours: (this.state.hours + 11) % 12
    }, this.props.onChange);
  },
  handleHourChange: function () {
    var state = {};
    state.hours = Math.max(parseInt(this.refs.hours.getValue(), 10) || 0, 0);
    if (state.hours < 24 && state.hours > 12) {
      state.hours = state.hours % 12;
      state.meridian = "PM";
    }
    this.setState(state, this.props.onChange);
  },
  handleMinuteUpClick: function () {
    this.setState({
      minutes: (this.state.minutes + this.props.minuteClickStep) % 60,
    }, this.props.onChange);
  },
  handleMinuteDownClick: function () {
    this.setState({
      minutes: (this.state.minutes + (60 - this.props.minuteClickStep)) % 60,
    }, this.props.onChange);
  },
  handleMinuteChange: function () {
    var minutesStr = this.refs.minutes.getValue();
    var minutes = parseInt(minutesStr, 10) || 0;
    if (minutesStr.length > 2 && minutes > 99) {
      minutes = Math.floor(minutes / 10);
    }
    this.setState({
      minutes: Math.max(parseInt(minutes, 10) || 0, 0),
    }, this.props.onChange);
  },
  handleMeridianClick: function () {
    this.setState({
      meridian: this.refs.meridian.getValue() == "AM" ? "PM" : "AM",
    }, this.props.onChange);
  },
  handleMeridianChange: function () {
    this.setState({
      meridian: this.refs.meridian.getValue(),
    }, this.props.onChange);
  },
  getMeridianStyle: function () {
    return (this.state.meridian == "AM" || this.state.meridian == "PM") ? null : "error";
  },
  getHourStyle: function () {
    return (this.state.hours < 23) ? null : "error";
  },
  getMinuteStyle: function () {
    return (this.state.minutes < 60) ? null : "error";
  },
  getPaddedMinutes: function () {
    return (this.state.minutes < 10) ? "0" + this.state.minutes : this.state.minutes;
  },
  render: function () {
    return (
      <span>
        <SpinnerInput type="text" ref="hours" value={this.state.hours} maxLength={2}
          groupClassName="timepicker-hours" bsStyle={this.getHourStyle()} disabled={this.props.disabled}
          onUpClick={this.handleHourUpClick} onDownClick={this.handleHourDownClick} onChange={this.handleHourChange} />
        <SpinnerInput type="text" ref="minutes" value={this.getPaddedMinutes()} maxLength={3}
          groupClassName="timepicker-mins" bsStyle={this.getMinuteStyle()} disabled={this.props.disabled}
          onUpClick={this.handleMinuteUpClick} onDownClick={this.handleMinuteDownClick} onChange={this.handleMinuteChange} />
        <SpinnerInput type="text" ref="meridian" value={this.state.meridian} maxLength={2}
          groupClassName="timepicker-meridian" bsStyle={this.getMeridianStyle()} disabled={this.props.disabled}
          onUpClick={this.handleMeridianClick} onDownClick={this.handleMeridianClick} onChange={this.handleMeridianChange} />
      </span>
    );
  }
});
