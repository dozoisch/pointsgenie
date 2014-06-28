/** @jsx React.DOM */
'use strict';
var React = window.React = require('react');
var reactNestedRouter = require('react-nested-router');
var Route = reactNestedRouter.Route;
var Link = reactNestedRouter.Link;

var IndexPage = require('./pages/index');
var NullPage = require('./pages/null');

var container = document.getElementById('page-container');

var App = React.createClass({
  render: function () {
    return (
      <div className='row' >
        <div className='col-md-2'>
          <h3>Liens</h3>
          <ul className='nav nav-pills nav-stacked' >
            <li><Link className='list-group-item' to='index'>Accueil</Link></li>
            <li><Link className='list-group-item' to='null-page'>Null</Link></li>
          </ul>
        </div>
        <div className='col-md-offset-0 col-md-9 well'>
          {this.props.activeRoute}
        </div>
      </div>
    );
  }
});

React.renderComponent(
  <Route handler={App} >
    <Route name='index' path='/' handler={IndexPage}  />
    <Route name='null-page' path='/null' handler={NullPage} />
  </Route>
, container);


