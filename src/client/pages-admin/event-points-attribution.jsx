/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;

var Table = require("react-bootstrap/Table");
var Input = require("react-bootstrap/Input");
var SpinnerInput = require("../components/utils/spinner-input");
var request = require("../middlewares/request");

var UserStore = require("../stores/user");
var EventStore = require("../stores/event");

var Navigation = require("react-router").Navigation;

module.exports = React.createClass({
  displayName: "AdminEventPointsAttribution",
  mixins: [Navigation],
  propTypes: {},
  getInitialState: function() {
    return {
      pointsRate: 1,
    };
  },
  componentWillMount: function () {
    UserStore.init();
  },
  componentDidMount: function () {
    UserStore.addChangeListener(this.updateUsers);
    request.get("/schedules/" + this.props.params.id, function (err, res) {
      if (err || res.status !== 200) {
        return; // @TODO handle errors
      }
      var users = this.getMappedUsers(res.body.schedule);
      this.setState({
        schedule: res.body.schedule,
        users: users,
       });
    }.bind(this));
  },
  componentWillUnmount: function() {
    UserStore.removeChangeListener(this.updateUsers);
  },
  getMappedUsers: function (schedule) {
    if (!schedule || !schedule.hours) {
      return null;
    }

    var hours = Object.keys(schedule.hours);
    var tasks = Object.keys(schedule.hours[hours[0]]);
    var users = {};
    hours.forEach(function (row) {
      tasks.forEach(function (column) {
        schedule.hours[row][column].forEach(function (id) {
          if (!users[id]) {
            var tasks = {};
            tasks[column] = 1;
            users[id] = {
              infos: UserStore.getUser(id),
              hours: 1,
              tasks: tasks,
              reason: schedule ? schedule.event.name : ""
            };
          } else {
            var user = users[id];
            ++(user.hours);
            var tasks = user.tasks;
            if (tasks[column]) {
              ++(tasks[column]);
            } else {
              user.tasks[column] = 1;
            }
          }
        });
      });
    });
    return users;
  },
  updateUsers: function () {
    if (this.state.schedule) {
      this.setState({ users: this.getMappedUsers(this.state.schedule) });
    }
  },
  handlePointsRateChange: function () {
    this.setState({ pointsRate: this.refs.pointsRate.getValue() });
  },
  handlePointsRateUpChange: function () {
    this.setState({
      pointsRate: this.state.pointsRate + 0.5
    });
  },
  handlePointsRateDownChange: function () {
    var pointsRate = this.state.pointsRate - 0.5;
    if (pointsRate < 0) {
      pointsRate = 0;
    }
    this.setState({
      pointsRate: pointsRate
    });
  },
  handleWorkerPointsUpChange: function (id) {
    var users = this.state.users
    var user = users[id];
    user.hours = user.hours + ( 0.5 / this.state.pointsRate );
    users[id] = user;
    this.setState({ users : users });
  },
  handleWorkerPointsDownChange: function (id) {
    var users = this.state.users
    var user = users[id];
    user.hours = user.hours - ( 0.5 / this.state.pointsRate );
    users[id] = user;
    this.setState({ users : users });
  },
  handleWorkerChange: function (id) {
    var users = this.state.users
    var user = users[id];
    user.hours = parseFloat(this.refs[id + "-points"].getValue(), 10) / this.state.pointsRate;
    user.reason = this.refs[id + "-reason"].getValue();
    users[id] = user;
    this.setState({ users : users });
  },
  handleSubmit: function (e) {
    e.preventDefault();
    var userData = {};
    Object.keys(this.state.users).forEach(function (id) {
      var user = this.state.users[id];
      userData[id] = {
        points : user.hours * this.state.pointsRate,
        reason: user.reason,
      };
    }, this);
    //UserStore.BatchAttributePoints(userData);

    if (this.refs.markEventAsPointsAttributed.getChecked()) {
      EventStore.markAsPointsAttributed(this.props.params.id);
    }

  },
  renderTaskList: function (tasks) {
    var taskList = Object.keys(tasks).map(function (task) {
      return (<li>{task} ({tasks[task]})</li>);
    });
    return <ul>{taskList}</ul>
  },
  renderScheduledUsers: function () {
    var users = this.state.users;
    return Object.keys(users).map(function (id) {
      var user = users[id];
      var boundOnChange = this.handleWorkerChange.bind(this, id);
      var boundUpClick = this.handleWorkerPointsUpChange.bind(this, id);
      var boundDownClick = this.handleWorkerPointsDownChange.bind(this, id);
      return (
        <tr key={id}>
          <td>{user.infos.name || user.infos.cip}</td>
          <td>{this.renderTaskList(user.tasks)}</td>
          <td>
            <SpinnerInput type="text" ref={user.infos.id + "-points"} onChange={boundOnChange}
              onUpClick={boundUpClick} onDownClick={boundDownClick}
              value={user.hours * (parseFloat(this.state.pointsRate, 10) || 0) } />
          </td>
          <td><Input type="text" value={user.reason} ref={user.infos.id + "-reason"} onChange={boundOnChange} /></td>
        </tr>
      );
    }, this);
  },
  renderTableHeader: function () {
    return (
      <thead>
        <tr>
          <th>Travailleur</th>
          <th>Tâches</th>
          <th>Points</th>
          <th>Raison</th>
        </tr>
      </thead>
    );
  },
  renderUserList: function () {
    return (
      <div className="worker-list">
        <h3>Travailleurs pour l''événement {this.state.schedule.event.name}</h3>
        <form onSubmit={this.handleSubmit}>
          <SpinnerInput type="text" ref="pointsRate" label="Ratio des points par heure de travail"
            value={this.state.pointsRate} onChange={this.handlePointsRateChange}
            onUpClick={this.handlePointsRateUpChange} onDownClick={this.handlePointsRateDownChange} />
          <Table bordered hover responsive striped>
            {this.renderTableHeader()}
            <tbody>
              {this.renderScheduledUsers()}
            </tbody>
          </Table>
          <Input type="checkbox" ref="markEventAsPointsAttributed" label="Marquer comme points attribués" />
        </form>
      </div>
    );
  },
  renderWaiting: function () {
    return (
      <div className="waiting">
        <h3>Horaire</h3>
        <div>Chargement en cours...</div>
      </div>
    );
  },
  render: function () {
    return (
      <div className="event-points-wrapper">
        { this.state.schedule && this.state.users ? this.renderUserList() : this.renderWaiting() }
      </div>
    );
  }
});
