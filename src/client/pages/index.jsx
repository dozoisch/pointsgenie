/** @jsx React.DOM */
"use strict";
var React = require("react");
var Counter = require("../components/counter");
var PointsLog = require("../components/points_log");

var event = {
  name: "derp",
  points: 1.0
};

var log = [event, event, event];

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
