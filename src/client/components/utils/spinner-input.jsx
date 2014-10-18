/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Input = require("react-bootstrap/Input");
var Button = require("react-bootstrap/Button");
var Glyphicon = require("react-bootstrap/Glyphicon");

var cx = require("react/lib/cx");

module.exports = React.createClass({
  displayName: "SpinnerInput",
  propTypes: {
    onUpClick: PropTypes.func.isRequired,
    onDownClick: PropTypes.func.isRequired,
    groupClassName: PropTypes.string,
    bsStyle: PropTypes.string,
    disabled: PropTypes.bool,
  },
  getDefaultProps: function() {
    return {
      disabled: false
    };
  },
  getValue: function () {
    return this.refs.input.getValue();
  },
  renderAddon: function () {
    return [
      <Button key="up" disabled={this.props.disabled} onClick={this.props.onUpClick}>
        <Glyphicon glyph="chevron-up" />
      </Button>,
      <Button key="down" disabled={this.props.disabled} onClick={this.props.onDownClick}>
        <Glyphicon glyph="chevron-down" />
      </Button>
    ];
  },
  render: function() {
    var groupClassName = { "input-spinner-group" : true };
    groupClassName[this.props.groupClassName] = this.props.groupClassName;

    return this.transferPropsTo(
      <Input ref="input" className="input-spinner" groupClassName={cx(groupClassName)}
        bsStyle={this.props.bsStyle} addonAfter={this.renderAddon()} />
    );
  }
});
