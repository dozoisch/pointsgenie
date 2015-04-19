"use strict";
import React, { PropTypes } from "react";
import { Row, Col, Input } from "react-bootstrap";

const EMPTY_TASK_KEY = "_empty_task_key_";

const ApplicationTaskPreferences = React.createClass({
  displayName: "ApplicationTaskPreferences",

  propTypes: {
    tasks: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
  },

  getFormData() {
    return this.refs.input.getValue() === EMPTY_TASK_KEY ? null : this.refs.input.getValue();
  },

  isValid() {
    return true;
  },

  renderOptions() {
    return [(<option key={EMPTY_TASK_KEY} value={EMPTY_TASK_KEY}>(Toutes)</option>)].concat(
      this.props.tasks.map((optionEntry, optionIndex) => {
        return (<option key={optionIndex} value={optionEntry}>{optionEntry}</option>);
      })
    );
  },

  render() {
    return (
      <Row>
        <Input type="select" ref="input" onChange={this.props.onChange}
        wrapperClassName="col-md-6">
          {this.renderOptions()}
        </Input>
      </Row>
    );
  },
});

export default ApplicationTaskPreferences;
