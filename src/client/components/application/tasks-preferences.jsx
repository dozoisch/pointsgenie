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
    return {
      first: this.refs.first.getValue(),
      second: this.refs.second.getValue(),
      third: this.refs.second.getValue(),
    };
  },
  isValid: function () {
    return true;
  },
  render: function () {
    var selectsInfo = [
      { ref: "first", label: "Premier choix" },
      { ref: "second", label: "Deuxième choix" },
      { ref: "third", label: "Troisième choix" },
    ];
    var selects = selectsInfo.map(function (selectEntry, selectIndex) {
      var options = this.props.tasks.map(function (optionEntry, optionIndex) {
        return (<option key={selectEntry.ref + optionIndex}>{optionEntry}</option>);
      });
      return (
        <Col md={4} key={selectEntry.ref}>
          <Input type="select" ref={selectEntry.ref} onChange={this.props.onChange}
          label={selectEntry.label}>
            {options}
          </Input>
        </Col>
        );
    }, this);
    return (<Row>{selects}</Row>);
  }
});
