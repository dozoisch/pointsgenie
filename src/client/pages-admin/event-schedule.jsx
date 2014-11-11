/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;

var Table = require("react-bootstrap/Table");
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
      this.setState({ schedule: res.body.schedule });
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
  updateUsers: function () {
    // @HACK keep a list of the users needed in the state
    this.forceUpdate();
  },
  renderTableBody: function (rows, columns) {
    var schedule = this.state.schedule.hours;
    var trs = rows.map(function (row) {
      var tds = columns.map(function (column) {
        var list = schedule[row][column].map(function (id) {
          var user = UserStore.getUser(id);
          return (<li>{user.name || user.cip}</li>);
        });
        return (
          <td><ul>{list}</ul></td>
        );
      });
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
    });
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
  render: function () {
    return (
      <div className="schedule-wrapper">
        { this.state.schedule ? this.renderSchedule() : this.renderWaiting() }
      </div>
    );
  }
});
