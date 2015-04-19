"use strict";
import React, { PropTypes } from "react";
import { Label, Glyphicon } from "react-bootstrap";

const Tag = React.createClass({
  displayName: "Tag",

  propTypes: {
    value: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([
      PropTypes.number.isRequired,
      PropTypes.string.isRequired
    ]),
    onRemove: PropTypes.func.isRequired,
  },

  handleRemove() {
    this.props.onRemove(this.props.id);
  },

  render() {
    return (
      <Label>{this.props.value} <Glyphicon glyph="remove" onClick={this.handleRemove} /></Label>
    );
  },
});

export default Tag;
