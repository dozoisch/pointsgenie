/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Input = require("react-bootstrap/Input");
var Button = require("react-bootstrap/Button");
var Row = require("react-bootstrap/Row");
var Col = require("react-bootstrap/Col");

var DatePicker = require("./date-time-picker/date");
var TimePicker = require("./date-time-picker/time");

module.exports = React.createClass({
  displayName: "DateTimePicker",
  propTypes: {
    label: PropTypes.string.isRequired,
    datePlaceholder: PropTypes.string,
    defaultDate: PropTypes.instanceOf(Date),
    onChange: PropTypes.func.isRequired,
  },
  getValue: function () {
    var date = this.refs.date.getValue();
    var time = this.refs.time.getValue();
    date.setHours(time.hours);
    date.setMinutes(time.minutes);
    return date;
  },
  render: function() {
    return (
      <Input wrapperClassName="wrapper" label={this.props.label}>
        <Row>
          <Col sm={4}>
            <DatePicker placeholder={this.props.datePlaceholder} defaultDate={this.props.defaultDate}
              ref="date" onChange={this.props.onChange} />
          </Col>
          <Col sm={8}><TimePicker ref="time" onChange={this.props.onChange} /></Col>
        </Row>
      </Input>
    );
  }
});
