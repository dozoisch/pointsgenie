/** @jsx React.DOM */
'use strict';
var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <form className="form" role="form" action="/login" method="post">
        <div className="form-group">
          <input type="text" placeholder="Email" className="form-control" />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Password" className="form-control" />
        </div>
        <button type="submit" className="btn btn-success">Sign in</button>
      </form>
    );
  }
});
