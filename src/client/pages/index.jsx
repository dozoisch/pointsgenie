/** @jsx React.DOM */
"use strict";
var React = require("react");
var PointsLog = require("../components/points-log");
var PostulateToEvent = require("../components/postulate-to-event");
var dateHelper = require("../middlewares/date");

var roles = (function () {
  var roles = [];
  for(var i = 0; i < 5; ++i) {
    roles.push("role " + i);
  }
  return roles;
})();

var event = function (length) {
  var startDate = new Date();
  return { name: "5@8 noel russe", startDate: startDate, endDate: dateHelper.addHours(dateHelper.clone(startDate), length), roles: roles };
};

var logEntry = function (id) {
  var randomNumber = Math.floor((Math.random()* 10 % 6)) + 1;
  return { id: id, points: randomNumber, event: event(randomNumber) };
};


var log = (function () {
  var log = [];
  for(var i = 0; i < 16; ++i) {
    log.push(logEntry("e" + i));
  }
  return log;
})();

module.exports = React.createClass({
  displayName: "IndexPage",
  render: function() {
    return (
      <div>
        <PostulateToEvent event={event(Math.floor((Math.random()* 10 % 8)) + 1)} />
        <PointsLog log={log} />
      </div>
    );
  }
})
