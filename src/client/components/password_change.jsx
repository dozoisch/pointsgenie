/** @jsx React.DOM */
"use strict";
var React = require("react");

module.exports = React.createClass({
  render: function () {
    return(
      <div className="user-password-change">
        <h4>Changer de mot de passe</h4>
        <form className="form-horizontal" role="form" name="password-change" action="" method="POST">
          <fieldset>
          <div className="form-group">
            <label className="control-label col-md-3" htmlFor="old_pw">Mot de passe courant:</label>
            <div className="col-md-6 col-md-offset-0">
              <input className="form-control" type="password" name="old_pw" placeholder="ancien"/>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-md-3" htmlFor="new_pw1">Nouveau mot de passe:</label>
            <div className="col-md-6 col-md-offset-0">
              <input className="form-control" type="password" name="new_pw1" placeholder="nouveau" />
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-md-3" htmlFor="new_pw2">Répéter mot de passe:</label>
            <div className="col-md-6 col-md-offset-0">
              <input className="form-control" type="password" name="new_pw2" placeholder="répéter" />
            </div>
          </div>
          <button type="submit" className="btn btn-success">Changer mot de passe</button>
          </fieldset>
        </form>
      </div>
    );
  }
});
