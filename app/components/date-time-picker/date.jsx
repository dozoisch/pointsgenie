"use strict";
import React, { PropTypes } from "react";
import { Input } from "react-bootstrap";

import Pikaday from "pikaday";

const DatePicker = React.createClass({
  displayName: "DatePicker",

  propTypes: {
    onChange: PropTypes.func.isRequired,
    minDate: PropTypes.instanceOf(Date),
    date: PropTypes.instanceOf(Date),
    i18n: PropTypes.object,
  },

  getDefaultProps() {
    return {
      i18n: {
        previousMonth : "Mois précédent",
        nextMonth     : "Mois suivant",
        months        : ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
        weekdays      : ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
        weekdaysShort : ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
      }
    };
  },
  getInitialState() {
    return {
      datePickerType: "date",
    };
  },
  getValue() {
    return this.state.datePicker.getDate();
  },

  componentDidMount() {
    const onChange = this.props.onChange;
    this.setState({
      datePicker: new Pikaday({
        field: this.refs.input.getInputDOMNode(),
        defaultDate: this.props.date,
        setDefaultDate: !!this.props.date,
        minDate: this.props.minDate,
        i18n: this.props.i18n,
        onSelect() {
          onChange();
        },
      }),
      datePickerType: "text",
    });
  },

  componentWillUnmount() {
    this.state.datePicker.destroy();
  },

  render() {
    const dateStr = this.props.date && this.props.date.toLocaleDateString();
    let { minDate, date, i18n, ...childProps } = this.props;
    return (<Input {...childProps} type={this.state.datePickerType} ref="input" value={dateStr} />);
  },
});

export default DatePicker;
