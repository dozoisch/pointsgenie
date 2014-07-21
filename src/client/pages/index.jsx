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

var names = [
  "5@8 noel russe",
  "5@8 COSS THETA",
  "5@8 Relache",
  "5@8 Déguise ton buck",
  "5@8 Theme",
  "5@8 Bal en Brun",
  "5@8 Thug Life ",
  "5@8 Carnaval : Amène ton suit",
  "5@8 Stéréotypes français",
  "5@8 Mime vs Hawaïen",
  "5@8 Noel Russe",
  "5@8 Toy Story",
  "5@8 Heavy Metal Christmas",
  "5@8 Client du PFK",
  "5@8 Guerre des Tuques",
  "5@8 Jedi VS Grand-Mère Grognonne",
  "5@8 Pyjama Party",
  "5@8 Fiesta del Carlos",
  "5@8 Cabane à Sucre",
  "5@8 Japs",
  "5@8 Redneck",
  "5@8 Le Livre de la Jungle",
  "5@8 Happy Gilmore",
  "5@8 British Invasion",
  "5@8 L",
  "5@8 Zombies à l",
  "5@8 COSS THETA FLUO",
  "5@8 color blind",
  "5@8 Vas-tu t",
  "5@8 Déménagement à Ottawa",
  "5@8 Yoga and Pilates",
  "5@11 Leucan",
  "5@8 Émissions pour enfants"
];

var event = function (randomNumber) {
  var startDate = new Date();
  return { name: names[randomNumber % names.length], startDate: startDate, endDate: dateHelper.addHours(dateHelper.clone(startDate), randomNumber % 10), roles: roles };
};

var eventList = function (length) {
  var l = [];
  for(var i = 0; i < length; ++i) {
    var randomNumber = Math.floor((Math.random()* 1000)) + 1;
    l.push(event(randomNumber));
  }
  return [];//l;
};

var logEntry = function (id) {
  var randomNumber = Math.floor((Math.random()* 10)) + 1;
  return { id: id, points: randomNumber % 5, event: event(randomNumber) };
};


var log = (function () {
  var log = [];
  for(var i = 0; i < 16; ++i) {
    log.push(logEntry("e" + i));
  }
  return log;
})();

module.exports = React.createClass({
  getInitialState: function() {
    return {
      log: [],
      eventList: [],
    };
  },
  displayName: "IndexPage",
  render: function() {
    return (
      <div>
        <PostulateToEvent eventList={eventList(Math.floor((Math.random()* 10 % 8)) + 3)} />
        <PointsLog log={log} />
      </div>
    );
  }
})
