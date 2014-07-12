/** @jsx React.DOM */
"use strict";
var React = require("react");
var Counter = require("../components/counter");
var PointsLog = require("../components/points_log");

var event = function (id) {
  return { name: "5@8 noel russe", points: Math.floor((Math.random()* 10 % 6)) + 1, date: new Date(), id: id };
};

var log = (function () {
  var log = [];
  for(var i = 0; i < 16; ++i) {
    log.push(event("e" + i));
  }
  return log;
})();

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <Counter />
        <PointsLog log={log} />
      </div>
    );
  }
})
