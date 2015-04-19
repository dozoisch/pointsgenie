"use strict";
import React, { PropTypes } from "react";

import { Input } from "react-bootstrap";

module.exports = React.createClass({
  displayName: "SearchBar",
  propTypes: {
    filterText: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
  },
  getValue: function () {
    return this.refs.input.getValue();
  },
  getDefaultProps: function() {
      return {
          placeholder: "Recherche...",
          type: "search",
      };
  },
  render: function() {
    return (
      <form>
        <Input type={this.props.type} placeholder={this.props.placeholder} ref="input"
          value={this.props.filterText} onChange={this.props.onChange}
        />
      </form>
    );
  }
});
