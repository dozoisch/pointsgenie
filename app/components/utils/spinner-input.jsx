"use strict";
import React, { PropTypes } from "react";
import { Input, Button, Glyphicon } from "react-bootstrap";
import cx from "classnames";

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
    var groupClasses = cx("input-spinner-group", this.props.groupClassName);
    var { disabled, onUpClick, onDownClick, groupClassName, ...childProps } = this.props
    return (
      <Input {...childProps}  ref="input" className="input-spinner" groupClassName={groupClasses}
        addonAfter={this.renderAddon()} />
    );
  }
});
