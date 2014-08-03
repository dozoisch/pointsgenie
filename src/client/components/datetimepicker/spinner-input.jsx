/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Input = require("react-bootstrap/Input");
var Button = require("react-bootstrap/Button");
var Glyphicon = require("react-bootstrap/Glyphicon");

module.exports = React.createClass({
  displayName: "SpinnerInput",
  propTypes: {
    onUpClick: PropTypes.func.isRequired,
    onDownClick: PropTypes.func.isRequired,
    groupClassName: PropTypes.string,
    bsStyle: PropTypes.string
  },
  getValue: function () {
    return this.refs.input.getValue();
  },
  renderAddon: function () {
    return (
      <span>
        <Button><Glyphicon glyph="chevron-up" onClick={this.props.onUpClick} /></Button>
        <Button><Glyphicon glyph="chevron-down" onClick={this.props.onDownClick} /></Button>
      </span>
    );
  },
  render: function() {
    return this.transferPropsTo(
      <Input ref="input" className="input-spinner" groupClassName={this.props.groupClassName}
        bsStyle={this.props.bsStyle} addonAfter={this.renderAddon()} />
    );
  }
});
