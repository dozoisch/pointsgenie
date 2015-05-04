import React, { PropTypes } from "react";
import { Row, Col, Input } from "react-bootstrap";

const EMPTY_TASK_KEY = "_empty_task_key_";

const ApplicationTasksPreference = React.createClass({
  displayName: "ApplicationTasksPreference",

  propTypes: {
    tasks: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
  },

  getFormData() {
    return this.refs.input.getValue() === EMPTY_TASK_KEY ? null : this.refs.input.getValue();
  },

  getEmptyTaskValue() {
    return "(Toutes)";
  },

  getValue() {
    if (this.props.readOnly) {
      return this.props.value || this.getEmptyTaskValue();
    }
    return this.props.value || EMPTY_TASK_KEY;
  },

  renderOptions() {
    if (this.props.readOnly) {
      return null;
    }
    return [(<option key={EMPTY_TASK_KEY} value={EMPTY_TASK_KEY}>{this.getEmptyTaskValue()}</option>)].concat(
      this.props.tasks.map((optionEntry, optionIndex) => {
        return (<option key={optionIndex} value={optionEntry}>{optionEntry}</option>);
      })
    );
  },



  render() {
    const value = this.getValue();
    const type = this.props.readOnly ? "static" : "select";
    return (
      <Row>
        <Input type={type} ref="input" onChange={this.props.onChange} value={value}
        wrapperClassName="col-md-6">
          {this.renderOptions()}
        </Input>
      </Row>
    );
  },
});

export default ApplicationTasksPreference;
