/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Row = require("react-bootstrap/Row");
var Col = require("react-bootstrap/Col");
var Input = require("react-bootstrap/Input");

module.exports = React.createClass({
  displayName: "ApplicationTaskPreferences",
  propTypes: {
    tasks: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
  },
  getFormData: function () {
    return this.refs.input.getValue();
  },
  isValid: function () {
    return true;
  },
  render: function () {
    var options = [(<option key="_empty_task_key_">(Aucune)</option>)].concat(
      this.props.tasks.map(function (optionEntry, optionIndex) {
        return (<option key={optionIndex}>{optionEntry}</option>);
      })
    );
    return (
      <Row>
        <Input type="select" ref="input" onChange={this.props.onChange}
        wrapperClassName="col-md-6">
          {options}
        </Input>
      </Row>
    );
  }
});
