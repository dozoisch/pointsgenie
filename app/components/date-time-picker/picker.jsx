"use strict";
import React, { PropTypes } from "react";
import { Input, Button, Row, Col } from "react-bootstrap";

import DatePicker from "./date";
import TimePicker from "./time";

const DateTimePicker = React.createClass({
  displayName: "DateTimePicker",

  propTypes: {
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    datePlaceholder: PropTypes.string,
    date: PropTypes.instanceOf(Date),
    minDate: PropTypes.instanceOf(Date),
    bsStyle: PropTypes.string,
  },

  getValue() {
    let date = this.refs.date.getValue();

    // If date is null return directly
    if (!date) {
     return date;
    }

    const time = this.refs.time.getValue();
    date.setHours(time.hours);
    date.setMinutes(time.minutes);
    return date;
  },

  render() {
    return (
      <Input wrapperClassName="wrapper" label={this.props.label}
        help={this.props.help} bsStyle={this.props.bsStyle}>
        <Row>
          <Col sm={4}>
            <DatePicker placeholder={this.props.datePlaceholder} ref="date"
              date={this.props.date} minDate={this.props.minDate}
              onChange={this.props.onChange} />
          </Col>
          <Col sm={8}>
            <TimePicker ref="time" time={this.props.date} onChange={this.props.onChange} />
          </Col>
        </Row>
      </Input>
    );
  }
});

export default DateTimePicker;
