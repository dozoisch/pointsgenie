/** @jsx React.DOM */
"use strict";
var React = require("react");

module.exports = React.createClass({
  render: function () {
    return (
      <div className="user-general-info">
        <h4>Informations générales</h4>
        <form className="form-horizontal">
          <fieldset>
          <div className="form-group">
            <label className="control-label col-md-3">Cip:</label>
            <div className="col-md-6 col-md-offset-0"><input disabled className="form-control" type="text" value={this.props.infos.cip} /></div>
          </div>
          <div className="form-group">
            <label className="control-label col-md-3">Courriel:</label>
            <div className="col-md-6 col-md-offset-0"><input disabled className="form-control" type="text" value={this.props.infos.email} /></div>
          </div>
          <div className="form-group">
            <label className="control-label col-md-3">Nom:</label>
            <div className="col-md-6 col-md-offset-0"><input disabled className="form-control" type="text" value={this.props.infos.name} /></div>
          </div>
          </fieldset>
        </form>
      </div>
    );
  }
});
