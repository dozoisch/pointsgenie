"use strict";
import React, { PropTypes } from "react";
import cx from "classnames";
import { Input } from "react-bootstrap";

import Tag from "./tag";

const TagListInput = React.createClass({
  displayName: "TagListInput",

  propTypes: {
    label: PropTypes.string.isRequired,
    onRemove: PropTypes.func.isRequired,
    onNew: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string
        ]),
        value: PropTypes.string,
      })
    ).isRequired,
    placeholder: PropTypes.string,
    isInvalid: PropTypes.bool,
  },

  getInitialState() {
    return {
      hasFocus: false,
    };
  },

  handleChange() {
    let state = {};
    let input = this.refs.input.getValue();
    if (input.substr(-1) === ",") {
      input = input.substr(0, input.length - 1).trim();
      if(input.length > 0) {
        this.props.onNew(input);
      }
      state.input = "";
    } else {
     state.input = input;
    }

    this.setState(state);
  },

  handleFocus() {
    this.setState({ hasFocus: true, });
  },

  handleBlur() {
    this.setState({ hasFocus: false, });
  },

  handleClick() {
    this.refs.input.getInputDOMNode().focus();
  },

  renderTags() {
    if (this.props.tags.length < 1) {
      return null;
    }
    const tags = this.props.tags.map((element, i) => {
      return (
        <li key={i}>
          <Tag id={element.key} value={element.value} onRemove={this.props.onRemove} />
        </li>
      );
    });
    return (<ul className="list-inline">{tags}</ul>);
  },

  render() {
    const classes = cx("tag-list-input", { focus: this.state.hasFocus });
    return (
      <Input wrapperClassName="wrapper" label={this.props.label}
        help={this.props.help} bsStyle={this.props.isInvalid ? "error" : null} >
        <div className={classes} onClick={this.handleClick}>
          {this.renderTags()}
          <Input ref="input" type="text" value={this.state.input} placeholder={this.props.placeholder}
            onFocus={this.handleFocus} onBlur={this.handleBlur} onChange={this.handleChange} />
        </div>
      </Input>
    );
  }
});

export default TagListInput;
