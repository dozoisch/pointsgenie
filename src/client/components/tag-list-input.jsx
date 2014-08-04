/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var cx = require("react/lib/cx");
var Input = require("react-bootstrap/Input");

var Tag = require("./tag-list/tag");

module.exports = React.createClass({
  displayName: "TagListInput",
  propTypes: {
    label: PropTypes.string.isRequired,
    defaultTags: PropTypes.arrayOf(PropTypes.string),
  },
  getInitialState: function () {
    return {
      tags: this.props.defaultTags || [],
      hasFocus: false,
    };
  },
  getValue: function () {
    return this.state.tags;
  },
  handleRemove: function (index) {
    this.setState({
      tags: this.state.tags.filter(function (value, i) {
        return index ^ i;
      }),
    });
  },
  handleChange: function () {
    var state = {};
    var newTag = this.refs.newTag.getValue();
    if (newTag.substr(-1) === ",") {
      newTag = newTag.substr(0, newTag.length - 1).trim();
      if(newTag.length > 0) {
        state.tags = this.state.tags.concat([newTag]);
      }
      state.newTag = "";
    } else {
     state.newTag = newTag;
    }
    this.setState(state);
  },
  handleFocus: function () {
    this.setState({
      hasFocus: true,
    });
  },
  handleBlur: function () {
    this.setState({
      hasFocus: false,
    });
  },
  renderTags: function () {
    if(this.state.tags.length < 1) {
      return null;
    }
    var tags = this.state.tags.map(function (element, i) {
      return <li key={i}><Tag index={i} value={element} onRemove={this.handleRemove} /></li>
    }, this);
    return <ul className="list-inline">{tags}</ul>
  },
  render: function () {
    var classes = cx({
      "tag-list-input": true,
      focus: this.state.hasFocus,
    });
    return (
      <Input wrapperClassName="wrapper" label={this.props.label} help="Appuyez sur la virgule pour séparer les éléments">
        <div className={classes}>
          {this.renderTags()}
          <Input ref="newTag" type="text" value={this.state.newTag}
            onFocus={this.handleFocus} onBlur={this.handleBlur} onChange={this.handleChange} />
        </div>
      </Input>
    );
  }
});
