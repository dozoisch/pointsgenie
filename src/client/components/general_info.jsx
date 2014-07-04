/** @jsx React.DOM */
"use strict";
var React = require("react");
var Input = require('react-bootstrap/Input');


module.exports = React.createClass({
  render: function() {
    return (
      <div className="user-general-info">
        <h4>Informations générales</h4>
        <form className="form-horizontal">
          <fieldset>
            <Input type="static" label="Cip:" labelClassName="col-md-3" wrapperClassName="col-md-6" value={this.props.infos.cip} />
            <Input type="static" label="Courriel:" labelClassName="col-md-3" wrapperClassName="col-md-6" value={this.props.infos.email} />
            <Input type="static" label="Nom:" labelClassName="col-md-3" wrapperClassName="col-md-6" value={this.props.infos.name} />
          </fieldset>
        </form>
      </div>
    );
  }
});
