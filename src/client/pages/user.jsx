/** @jsx React.DOM */
'use strict';
var React = require('react');

module.exports = React.createClass({
  render: function () {
    var self = this;
    var promocard = (function () {
      var inner = (function () {
         if(self.props.user && self.props.user.promocard && self.props.user.promocard.price) {
          return (
            <form className="form-horizontal">
              <fieldset>
                <div className="form-group">
                  <label className="control-label col-md-3">Prix Payé:</label>
                  <div className="col-md-6 col-md-offset-0">
                    <input disabled className="form-control" type="text" value="{'this.props.user.promocard.price'}" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-md-3">Date:</label>
                  <div className="col-md-6 col-md-offset-0">
                    <input disabled className="form-control" type="text" value="{'this.props.promocard.created'}" />
                  </div>
                </div>
              </fieldset>
            </form>
          );
        } else {
          return (<p> La promocarte n'a pas été achetée encore</p>);
        }
      })();
      return (
        <div className="user-promocard-info">
          <h4>Promocarte</h4>
          {inner}
        </div>
      );
    })();

    return (
      <div className="user-info">
        <div className="user-general-info">
          <h4>Informations générales</h4>
          <form className="form-horizontal">
            <fieldset>
            <div className="form-group">
              <label className="control-label col-md-3">Cip:</label>
              <div className="col-md-6 col-md-offset-0"><input disabled className="form-control" type="text" value="{'this.props.user.cip'}" /></div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-3">Courriel:</label>
              <div className="col-md-6 col-md-offset-0"><input disabled className="form-control" type="text" value="{'this.props.user.email'}" /></div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-3">Nom:</label>
              <div className="col-md-6 col-md-offset-0"><input disabled className="form-control" type="text" value="{'this.props.user.name'}" /></div>
            </div>
            </fieldset>
          </form>
        </div>
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
        {promocard}
      </div>
    );
  }
});
