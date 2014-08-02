/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Input = require("react-bootstrap/Input");
var Button = require("react-bootstrap/Button");
var Row = require("react-bootstrap/Row");
var Col = require("react-bootstrap/Col");

var DatePicker = require("./datetimepicker/date");
var TimePicker = require("./datetimepicker/time");

module.exports = React.createClass({
  displayName: "DateTimePicker",
  propTypes: {
    label: PropTypes.string.isRequired,
    datePlaceholder: PropTypes.string,
    defaultDate: PropTypes.instanceOf(Date),
    onChange: PropTypes.func.isRequired,
  },
  getValue: function () {
    // @ TODO
    return new Date();
  },
  render: function() {
    return (
      <Input wrapperClassName="wrapper" label={this.props.label}>
        <Row>
          <Col md={6}><DatePicker placeholder={this.props.datePlaceholder} defaultDate={this.props.defaultDate} /></Col>
          <Col md={6}><TimePicker /></Col>
        </Row>

      </Input>
    );
  }
});
