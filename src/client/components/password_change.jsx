/** @jsx React.DOM */
"use strict";
var React = require("react");
var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');
var request = require("../middlewares/request");

// <Input type="static" label="Nom:" labelClassName="col-md-3" wrapperClassName="col-md-6" value={this.props.infos.name} />


module.exports = React.createClass({
  handleSubmit: function () {
    // do smth
  },
  renderOldPassword: function () {
    if(this.props.hasPassword) {
      return (
          <Input
            type="password" label="Mot de passe actuel:"
            labelClassName="col-md-3" wrapperClassName="col-md-6"
            name="curr_pw" placeholder="actuel"
          />
      );
    }
    return (
      <Input type="static" label="Mot de passe actuel:"
        labelClassName="col-md-3" wrapperClassName="col-md-6"
        value="Vous n'avez pas encore de mot de passe"
      />
    );
  },
  render: function () {
    return(
      <div className="user-password-change">
        <h4>Changer de mot de passe</h4>
        <form className="form-horizontal" role="form" name="password-change" action="/user/me/password" method="POST">
          <fieldset>
          {this.renderOldPassword()}
          <Input
            type="password" label="Nouveau mot de passe:"
            labelClassName="col-md-3" wrapperClassName="col-md-6"
            name="new_pw1" placeholder="nouveau"
          />
          <Input
            type="password" label="Répéter mot de passe:"
            labelClassName="col-md-3" wrapperClassName="col-md-6"
            name="new_pw2" placeholder="répéter"
          />
          <Button type="submit" onClick={this.handleSubmit} bsStyle="success">Changer mot de passe</Button>
          </fieldset>
        </form>
      </div>
    );
  }
});
