"use strict";
import React, { PropTypes } from "react";

import { Input } from "react-bootstrap";

const SearchBar = React.createClass({
  displayName: "SearchBar",

  propTypes: {
    filterText: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func,
  },

  getValue() {
    return this.refs.input.getValue();
  },

  getDefaultProps() {
    return {
      placeholder: "Recherche...",
      type: "search",
    };
  },

  render() {
    let { filterText, ...props }  = this.props;
    return (
      <form>
        <Input {...props} ref="input" value={filterText} />
      </form>
    );
  },
});

export default SearchBar;
