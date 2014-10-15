/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Input = require("react-bootstrap/Input");
var Row = require("react-bootstrap/Row");
var Col = require("react-bootstrap/Col");
var Button = require("react-bootstrap/Button");

var dateHelper = require("../middlewares/date");

module.exports = React.createClass({
  displayName: "MatchToEventForm",
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
        uid: PropTypes.string.isRequired,
        totalPoints : PropTypes.number.isRequired,
      })
    ).isRequired,
    isSubmitting: PropTypes.bool,
  },
  getInitialState: function () {
    return {
      applications: this.getMappedApplications()
    };
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.applications) {
      this.setState({ applications: this.getMappedApplications() });
    }
  },
  getFormData: function () {
    var data = {};
    Object.keys(this.refs).forEach(function (elem, i) {
      var index = elem.indexOf("-");
      var time = elem.substring(0, index);
      var task = elem.substring(index + 1);
      data[time] = data[time] || {};
      data[time][task] = [];
      // Thanks to IE 10-11 that do not support .selectedOptions...
      var select = this.refs[elem].getInputDOMNode();
      var options = select.options;
      for (var i = select.selectedIndex; i < options.length; ++i) {
        if (options[i].selected) {
          data[time][task].push(options[i].value);
        }
      }
    }, this);

    return data;
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
          mappedApplications[hour][task].push({
            uid: application.user,
            // Reducre the rank if it's users preferred task
            rank: userPoints * (task === application.preferredTask ? 95 : 100)
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
      return this.props.users[user.uid];
    }, this);
  },
  renderSelectBox: function (task, users, time) {
    var options = users.map(function (user, index) {
      return (<option key={user.uid} value={user.uid}>{user.totalPoints || 0} - {user.name}</option>);
    }, this);
    options.push(<option key="herp" value="herp">herp</option>); // @TEST
    return (
      <Col xs={6} md={4} key={task}>
        <Input type="select" multiple label={task} ref={time + "-" + task} time={time} task={task}>
          {options}
        </Input>
      </Col>
    );
  },
  renderHours: function () {
    var tasks = this.props.event.tasks.filter(function (task) {
      return task != this.props.event.wildcardTask;
    }, this);

    var currDate = dateHelper.clone(this.props.event.startDate);
    var rows = [];
    while(currDate.getTime() < this.props.event.endDate.getTime()) {
      var key = currDate.getTime();
      var row = [];
      for (var i = 0; i < tasks.length; ++i) {
        var users = this.getUsersFromMappedApplication(currDate.toISOString(), tasks[i]);
        row.push(this.renderSelectBox(tasks[i], users, key));
      }
      rows.push(
        <Input key={currDate.getTime()} label={currDate.toLocaleString()} wrapperClassName="wrapper">
          <Row>{row}</Row>
        </Input>
      );

      // Get next hour
      currDate = dateHelper.addHours(currDate, 1);
    }
    return rows;
  },
  renderSubmitButton: function () {
    return (
      <Button type="submit" disabled={this.props.isSubmitting} bsStyle="success">
        { this.props.isSubmitting ? "En cours...": "Attribuer les tâches" }
      </Button>
    );
  },
  render: function () {
    return (
      <form onSubmit={this.props.onSubmit} role="form">
        {this.renderHours()}
        {this.renderSubmitButton()}
        <span className="help-block">
          Notez qu'attribuer les postes fermera l'événement. Il ne sera plus possible d'y postuler.
        </span>
      </form>
    );
  }
});
