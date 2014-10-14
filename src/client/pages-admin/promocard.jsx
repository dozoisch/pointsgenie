/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Input = require("react-bootstrap/Input");
var Button = require("react-bootstrap/Button");

var request = require("../middlewares/request");
var UserStore = require("../stores/user");

var Navigation = require("react-router").Navigation;

module.exports = React.createClass({
  displayName: "AdminPromocard",
  mixins: [Navigation],
  propTypes: {
  },
  getInitialState: function () {
    return {};
  },
  onSubmit: function (e) {
    e.preventDefault();
    request.post("/promocard/" + this.refs.cip.getValue(), {}, function (err, res) {
      if (!err && res.status === 200) {
        UserStore.fetchAll(); // @TODO optimize that...
        this.transitionTo("/users");
      } else {
        this.setState({ isValid: false });
      }
    }.bind(this));
  },
  onChange: function () {
    var state = {
      isValid: true,
    };
    state.cip = this.refs.cip.getValue();
    if (!state.cip.match(/^[a-zA-Z]{4}[0-9]{4}$/)) {
      state.isValid = false;
    }
    this.setState(state);
  },
  renderSubmitButton: function () {
    return (
      <Button type="submit" disabled={!this.state.isValid || this.props.isSubmitting} bsStyle="success">
        { this.props.isSubmitting ? "En cours...": "Attribuer la promocarte" }
      </Button>
    );
  },
  render: function() {
    var isValid = this.state.isValid;
    return (
      <div>
        <h3>Attribuer une promocarte</h3>
        <form className="form-horizontal" onSubmit={this.onSubmit}>
          <Input type="text" label="Cip" ref="cip" onChange={this.onChange} value={this.state.cip}
          labelClassName="col-md-3"  wrapperClassName="col-md-3" bsStyle={isValid ? null : "error" }
          help={isValid ? null : "Le cip est invalide. Il doit être composé de 4 lettres suivi de 4 chiffres" } />
          {this.renderSubmitButton()}
        </form>
      </div>
    );
  }
});
