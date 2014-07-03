/** @jsx React.DOM */
'use strict';
var React = require('react');

module.exports = React.createClass({
    inner: function () {
     if(this.props.promocard.price) {
      return (
        <form className="form-horizontal">
          <fieldset>
            <div className="form-group">
              <label className="control-label col-md-3">Prix Payé:</label>
              <div className="col-md-6 col-md-offset-0">
                <input disabled className="form-control" type="text" value={this.props.promocard.price} />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-3">Date:</label>
              <div className="col-md-6 col-md-offset-0">
                <input disabled className="form-control" type="text" value={this.props.promocard.created} />
              </div>
            </div>
          </fieldset>
        </form>
      );
    }
    return (<p> La promocarte n'a pas été achetée encore</p>);
  },
  render: function() {
    return (
      <div className="user-promocard-info">
        <h4>Promocarte</h4>
        {this.inner()}
      </div>
    );
  }
})
