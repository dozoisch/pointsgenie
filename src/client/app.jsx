var React = require('react');
var IndexPage = require('./pages/index');
// var AuthComponent = require('./components/auth');

var container = document.getElementById('page-container');
// var navbar = document.getElementById('navbarmenu');

// React.renderComponent(<AuthComponent />, navbar);
React.renderComponent(<IndexPage theme="blue"/>, container);
