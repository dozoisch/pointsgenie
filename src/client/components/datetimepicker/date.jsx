/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Input = require("react-bootstrap/Input");

var Pikaday = require("pikaday");

module.exports = React.createClass({
  displayName: "DatePicker",
  propTypes: {
    defaultDate: PropTypes.instanceOf(Date).isRequired,
    onChange: PropTypes.func.isRequired,
    i18n: PropTypes.object,
  },
  getDefaultProps: function() {
    return {
      i18n: {
        previousMonth : "Mois précdédent",
        nextMonth     : "Mois suivant",
        months        : ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
        weekdays      : ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
        weekdaysShort : ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
      }
    };
  },
  componentDidMount: function() {
    this.setState({
      datePicker: new Pikaday({
        field: this.refs.input.getInputDOMNode(),
        defaultDate: this.props.defaultDate,
        minDate: new Date(),
        i18n: this.props.i18n,
      }),
      datePickerType: "text",
    });
  },
  render: function () {
    return this.transferPropsTo(
      <Input type={this.state.datePickerType} ref="input" onChange={this.onChange} />
    );
  },
});
