import React, { PropTypes } from "react";
import { Table, Input } from "react-bootstrap";

import request from "../middlewares/request";

import UserStore from "../stores/user";

const AdminEventSchedule = React.createClass({
  displayName: "AdminEventSchedule",

  contextTypes: {
    router: PropTypes.func
  },

  getInitialState() {
    return {};
  },

  componentWillMount() {
    UserStore.init();
  },

  componentDidMount() {
    UserStore.addChangeListener(this.updateUsers);
    const { id } = this.context.router.getCurrentParams();
    request.get("/schedules/" + id, (err, res) => {
      if (err) {
        return; // @TODO handle errors
      }
      let users = this.getMappedUsers(res.body.schedule);
      this.setState({
        schedule: res.body.schedule,
        users: users,
       });
    });
  },

  componentWillUnmount() {
    UserStore.removeChangeListener(this.updateUsers);
  },

  renderTableHeader(columns) {
    let ths = columns.map((column) => {
      return (<th>{column}</th>);
    });
    return (
      <thead>
        {ths}
      </thead>
    );
  },

  getMappedUsers(schedule) {
    if (!schedule || !schedule.hours) {
      return null;
    }

    let hours = Object.keys(schedule.hours);
    let tasks = Object.keys(schedule.hours[hours[0]]);
    let users = {};
    // @TODO
    hours.forEach((row) => {
      tasks.forEach((column) => {
        schedule.hours[row][column].forEach((id) => {
          if (!users[id]) {
            users[id] = UserStore.getUser(id);
          }
        });
      });
    });
    return users;
  },

  updateUsers() {
    if (this.state.schedule) {
      this.setState({ users: this.getMappedUsers(this.state.schedule) });
    }
  },

  renderTableBody(rows, columns) {
    let schedule = this.state.schedule.hours;
    let trs = rows.map((row) => {
      let tds = columns.map((column) => {
        let list = schedule[row][column].map((id) => {
          let user = this.state.users[id];
          return (<li>{user.name || user.cip}</li>);
        });
        return (
          <td><ul>{list}</ul></td>
        );
      });
      let date = new Date(Number(row));
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

  renderSchedule() {
    let schedule = this.state.schedule.hours;
    let columns = ["Heures"];
    let rows = [];
    if (schedule) {
      rows = Object.keys(schedule);
    }

    if (rows.length > 0) {
      columns = columns.concat(Object.keys(schedule[rows[0]]));
    }
    let name = this.state.schedule.event ? this.state.schedule.event.name : "";
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

  renderWaiting() {
    return (
      <div className="waiting">
        <h3>Horaire</h3>
        <div>Chargement en cours...</div>
      </div>
    );
  },

  renderUserEmails() {
    let userEmails = [];
    let missingEmails = [];
    Object.keys(this.state.users).forEach((id) => {
      let user = this.state.users[id];
      if (user.email) {
        userEmails.push(user.email);
      } else {
        missingEmails.push(user.name || user.cip);
      }
    });
    let withoutEmail = missingEmails.length < 1 ? null :
      (<Input type="static" label="Travailleurs sans courriels" value={missingEmails.join(", ")} />);

    return (
      <div className="not-printable-content">
        <Input type="static" label="Courriels des travailleurs" value={userEmails.join(", ")} />
        {withoutEmail}
      </div>
    );

  },

  render() {
    return (
      <div className="schedule-wrapper">
        { this.state.schedule && this.state.users ? this.renderSchedule() : this.renderWaiting() }
      </div>
    );
  }
});

export default AdminEventSchedule;
