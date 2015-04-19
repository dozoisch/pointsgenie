"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var cx = require("react/lib/cx");
var Input = require("react-bootstrap/Input");

var Tag = require("./tag");

module.exports = React.createClass({
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
  getInitialState: function () {
    return {
      hasFocus: false,
    };
  },
  handleChange: function () {
    var state = {};
    var input = this.refs.input.getValue();
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
  handleClick: function () {
    this.refs.input.getInputDOMNode().focus();
  },
  renderTags: function () {
    if(this.props.tags.length < 1) {
      return null;
    }
    var tags = this.props.tags.map(function (element, i) {
      return <li key={i}><Tag key={element.key} value={element.value} onRemove={this.props.onRemove} /></li>
    }, this);
    return <ul className="list-inline">{tags}</ul>
  },
  render: function () {
    var classes = cx({
      "tag-list-input": true,
      focus: this.state.hasFocus,
    });
    return (
      <Input wrapperClassName="wrapper" label={this.props.label}
        help={this.props.help} bsStyle={this.props.isInvalid? "error" : null} >
        <div className={classes} onClick={this.handleClick}>
          {this.renderTags()}
          <Input ref="input" type="text" value={this.state.input} placeholder={this.props.placeholder}
            onFocus={this.handleFocus} onBlur={this.handleBlur} onChange={this.handleChange} />
        </div>
      </Input>
    );
  }
});
