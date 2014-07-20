/** @jsx React.DOM */
"use strict";
var React = require("react");
var PointsLog = require("../components/points-log");
var PostulateToEvent = require("../components/postulate-to-event");

var event = function (id) {
  return { name: "5@8 noel russe", points: Math.floor((Math.random()* 10 % 6)) + 1, date: new Date().toLocaleDateString(), id: id };
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
        <PostulateToEvent event={event(42)} />
        <PointsLog log={log} />
      </div>
    );
  }
})
