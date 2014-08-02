/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Input = require("react-bootstrap/Input");
var Button = require("react-bootstrap/Button");
var Row = require("react-bootstrap/Row");
var Col = require("react-bootstrap/Col");

var TimePicker = require("./timepicker");

var Pikaday = require("pikaday");

module.exports = React.createClass({
  displayName: "DateTimePicker",
  propTypes: {
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    defaultDate: PropTypes.instanceOf(Date).isRequired,
    onChange: PropTypes.func.isRequired,
  },
  getInitialState: function() {
    return {
      datePickerType: "date",
    };
  },
  componentDidMount: function() {
    var i18n = {
      previousMonth : "Mois précdédent",
      nextMonth     : "Mois suivant",
      months        : ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
      weekdays      : ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
      weekdaysShort : ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    };

    this.setState({
      datePicker: new Pikaday({
        field: this.refs.datepicker.getDOMNode(),
        defaultDate: this.props.defaultDate,
        minDate: new Date(),
        i18n: i18n,
      }),
      datePickerType: "text",
    });
  },
  getValue: function () {
    // @ TODO
    return new Date();
  },
  renderDatePicker: function () {
    return (
      <Input type={this.state.datePickerType} ref="datepicker"
        placeholder={this.props.placeholder} onChange={this.onChange} />
    );
  },
  renderHourPicker: function () {
    var hours = [];
    for (var i = 0; i < 24; ++i) {
      hours.push(
        <option value={i}>{i +"h"}</option>
      );
    }
    return (
      <Input type="select">
        {hours}
      </Input>
    );
  },
  renderMinutePicker: function () {
    var minutes = [];
    for (var i = 0; i < 60; i += 15) {
      minutes.push(
        <option value={i}>{i}</option>
      );
    }
    return (
      <Input type="select">
        {minutes}
      </Input>
    );
  },
  render: function() {
    return (
      <Input wrapperClassName="wrapper" label={this.props.label}>
        <Row>
          <Col md={6}>{this.renderDatePicker()}</Col>
          <Col md={2}>{this.renderHourPicker()}</Col>
          <Col md={2} >{this.renderMinutePicker()}</Col>
        </Row>
        <TimePicker />
      </Input>
    );
  }
});
