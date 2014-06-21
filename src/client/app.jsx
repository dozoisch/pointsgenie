var React = require('react');
var IndexPage = require('./pages/index');

var container = document.getElementById('page-container');

React.renderComponent(<IndexPage theme="blue"/>, container);
