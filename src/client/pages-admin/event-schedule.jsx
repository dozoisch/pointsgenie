/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;

var Table = require("react-bootstrap/Table");
var Input = require("react-bootstrap/Input");
var request = require("../middlewares/request");

var UserStore = require("../stores/user");
var EventStore = require("../stores/event");

var Navigation = require("react-router").Navigation;

module.exports = React.createClass({
  displayName: "AdminEventSchedule",
  mixins: [Navigation],
  propTypes: {},
  getInitialState: function() {
    return {};
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
  renderTableHeader: function (columns) {
    var ths = columns.map(function (column) {
      return (<th>{column}</th>);
    });
    return (
      <thead>
        {ths}
      </thead>
    );
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
            users[id] = UserStore.getUser(id);
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
  renderTableBody: function (rows, columns) {
    var schedule = this.state.schedule.hours;
    var trs = rows.map(function (row) {
      var tds = columns.map(function (column) {
        var list = schedule[row][column].map(function (id) {
          var user = this.state.users[id];
          return (<li>{user.name || user.cip}</li>);
        }, this);
        return (
          <td><ul>{list}</ul></td>
        );
      }, this);
      var date = new Date(Number(row));
      tds.unshift(
        <td>
          <ul>
            <li>{date.toLocaleDateString()}</li>
            <li>{date.toLocaleTimeString()}</li>
          </ul>
        </td>
      );
      return (
        <tr key={row}>
          {tds}
        </tr>
      );
    }, this);
    return (
      <tbody>
        {trs}
      </tbody>
    );
  },
  renderSchedule: function () {
    var schedule = this.state.schedule.hours;
    var columns = ["Heures"];
    var rows = [];
    if (schedule) {
      rows = Object.keys(schedule);
    }

    if (rows.length > 0) {
      columns = columns.concat(Object.keys(schedule[rows[0]]));
    }
    var name = this.state.schedule.event ? this.state.schedule.event.name : "";
    return (
      <div class="schedule">
        <h3>Horaire pour l'événement {name}</h3>
        { this.renderUserEmails() }
        <Table bordered hover responsive>
          {this.renderTableHeader(columns)}
          {this.renderTableBody(rows, Object.keys(schedule[rows[0]]) )}
        </Table>
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
  renderUserEmails: function () {
    var userEmails = [];
    var missingEmails = [];
    Object.keys(this.state.users).forEach(function(id) {
      var user = this.state.users[id];
      if (user.email) {
        userEmails.push(user.email);
      } else {
        missingEmails.push(user.name || user.cip);
      }
    }, this);
    var withoutEmail = missingEmails.length < 1 ? null :
      (<Input type="static" label="Travailleurs sans courriels" value={missingEmails.join(", ")} />);

    return (
      <div className="not-printable-content">
        <Input type="static" label="Courriels des travailleurs" value={userEmails.join(", ")} />
        {withoutEmail}
      </div>
    );

  },
  render: function () {
    return (
      <div className="schedule-wrapper">
        { this.state.schedule && this.state.users ? this.renderSchedule() : this.renderWaiting() }
      </div>
    );
  }
});
