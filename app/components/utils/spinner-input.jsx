"use strict";
import React, { PropTypes } from "react";
import { Input, Button, Glyphicon } from "react-bootstrap";
import cx from "classnames";

const SpinnerInput = React.createClass({
  displayName: "SpinnerInput",

  propTypes: {
    onUpClick: PropTypes.func.isRequired,
    onDownClick: PropTypes.func.isRequired,
    groupClassName: PropTypes.string,
    bsStyle: PropTypes.string,
    disabled: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      disabled: false
    };
  },

  getValue() {
    return this.refs.input.getValue();
  },

  renderAddon() {
    return [
      <Button key="up" disabled={this.props.disabled} onClick={this.props.onUpClick}>
        <Glyphicon glyph="chevron-up" />
      </Button>,
      <Button key="down" disabled={this.props.disabled} onClick={this.props.onDownClick}>
        <Glyphicon glyph="chevron-down" />
      </Button>
    ];
  },

  render() {
    const groupClasses = cx("input-spinner-group", this.props.groupClassName);
    let { disabled, onUpClick, onDownClick, groupClassName, ...childProps } = this.props
    return (
      <Input {...childProps}  ref="input" className="input-spinner" groupClassName={groupClasses}
        addonAfter={this.renderAddon()} />
    );
  }
});

export default SpinnerInput;
