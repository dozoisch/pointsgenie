/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Input = require("react-bootstrap/Input");
var Row = require("react-bootstrap/Row");
var Col = require("react-bootstrap/Col");
var Button = require("react-bootstrap/Button");
var TabbedArea = require("react-bootstrap/TabbedArea");
var TabPane = require("react-bootstrap/TabPane");

var dateHelper = require("../../middlewares/date");

var Form = require("./form");
var Printable = require("./printable");

module.exports = React.createClass({
  displayName: "MatchToEventWrapper",
  propTypes: {
    onSubmit: PropTypes.func.isRequired,
    event: PropTypes.shape({
      name: PropTypes.string,
      startDate: PropTypes.instanceOf(Date),
      endDate: PropTypes.instanceOf(Date),
      tasks: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    applications: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      user: PropTypes.string.isRequired,
      preferredTask: PropTypes.string,
      availabilities: PropTypes.arrayOf(
        PropTypes.instanceOf(Date)
      ).isRequired,
    })).isRequired,
    users: PropTypes.objectOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        totalPoints : PropTypes.number.isRequired,
      })
    ).isRequired,
    isSubmitting: PropTypes.bool,
  },
  getInitialState: function () {
    return {
      applications: this.getMappedApplications(),
    };
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.applications) {
      this.setState({ applications: this.getMappedApplications() });
    }
  },
  getFormData: function () {
    return this.refs.form.getFormData();
  },
  getMappedApplications: function () {
    var mappedApplications = {};
    // @FIX find better algo...
    this.props.applications.forEach(function (application) {
      var userTask = {};
      var user = this.props.users[application.user];

      // Skip it if the user is not found... should not happen
      if (!user) return;
      var userPoints = user.totalPoints || 0;
      // push in the map
      application.availabilities.forEach(function (hour) {
        mappedApplications[hour] = mappedApplications[hour] || {};
        this.props.event.tasks.forEach(function (task) {
          mappedApplications[hour][task] = mappedApplications[hour][task] || [];

          // Default is this is not the users preferred task
          var modifier = 105;
          var preferenceClassName = "not-preferred";
          if (!application.preferredTask) {
            // The user has no preferred task at all
            modifier = 100;
            preferenceClassName = "no-preference";
          } else if (application.preferredTask === task) {
            // This is the user preferred task
            modifier = 95;
            preferenceClassName = "preferred"
          }
          mappedApplications[hour][task].push({
            id: application.user,
            // Reduce the rank if it's users preferred task
            // Add one point to make sure that even 0 points users are ranked.
            rank: (userPoints + 1 ) * modifier,
            preferenceClassName: preferenceClassName,
          });
        });
      }, this);
    }, this);

    return mappedApplications;
  },
  getUsersFromMappedApplication: function (hour, task) {
    var applications = this.state.applications[hour];
    if (!applications) return [];
    var users = applications[task];
    if (!users) return [];
    // sort ascending
    users.sort(function (a, b) {
      return (a.rank - b.rank);
    });
    // retrieve real user array
    return users.map(function (user) {
      var modifiedUser = this.props.users[user.id];
      modifiedUser.preferenceClassName = user.preferenceClassName;
      return modifiedUser;
    }, this);
  },

  render: function () {
    return (
      <TabbedArea defaultActiveKey={1}>
        <TabPane key={1} tab="Formulaire">
          <Form ref="form" event={this.props.event}
            getHourTaskUserList={this.getUsersFromMappedApplication}
            isSubmitting={this.props.isSubmitting} onSubmit={this.props.onSubmit} />
        </TabPane>
        <TabPane key={2} tab="Imprimable">
          <Printable ref="printable" event={this.props.event}
            getHourTaskUserList={this.getUsersFromMappedApplication} />
        </TabPane>
      </TabbedArea>
    );
  }
});
