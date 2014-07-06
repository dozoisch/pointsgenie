/** @jsx React.DOM */
"use strict";
var React = require("react");
var Counter = require("../components/counter");
var PointsLog = require("../components/points_log");

var event = function (id) {
  return { name: "derp", points: 1.0, id: id };
};

var log = (function () {
  var log = [];
  for(var i = 0; i < 100; ++i) {
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
