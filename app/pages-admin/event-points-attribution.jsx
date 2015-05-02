import React, { PropTypes } from "react";
import { Table, Input, Button } from "react-bootstrap";

import SpinnerInput from "../components/utils/spinner-input";

import request from "../middlewares/request";

import UserStore from "../stores/user";

const AdminEventPointsAttribution = React.createClass({
  displayName: "AdminEventPointsAttribution",

  contextTypes: {
    router: PropTypes.func,
    flux: PropTypes.object,
  },

  getInitialState() {
    return { pointsRate: 1, };
  },

  componentWillMount() {
    UserStore.init();
  },

  componentDidMount() {
    UserStore.addChangeListener(this.updateUsers);
    request.get("/schedules/" + this.context.router.getCurrentParams().id, (err, res) => {
      if (err || res.status !== 200) {
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

  getMappedUsers(schedule) {
    if (!schedule || !schedule.hours) {
      return null;
    }

    const hours = Object.keys(schedule.hours);
    const tasks = Object.keys(schedule.hours[hours[0]]);
    let users = {};
    hours.forEach(function (row) {
      tasks.forEach(function (column) {
        schedule.hours[row][column].forEach(function (id) {
          if (!users[id]) {
            let tasks = {};
            tasks[column] = 1;
            users[id] = {
              infos: UserStore.getUser(id),
              hours: 1,
              tasks: tasks,
              reason: schedule ? schedule.event.name : ""
            };
          } else {
            let user = users[id];
            ++(user.hours);
            let tasks = user.tasks;
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

  updateUsers() {
    if (this.state.schedule) {
      this.setState({ users: this.getMappedUsers(this.state.schedule) });
    }
  },

  handlePointsRateChange() {
    this.setState({ pointsRate: this.refs.pointsRate.getValue() });
  },

  handlePointsRateUpChange() {
    this.setState({
      pointsRate: this.state.pointsRate + 0.5
    });
  },

  handlePointsRateDownChange() {
    let pointsRate = this.state.pointsRate - 0.5;
    if (pointsRate < 0) {
      pointsRate = 0;
    }
    this.setState({
      pointsRate: pointsRate
    });
  },

  handleWorkerPointsUpChange(id) {
    let users = this.state.users
    let user = users[id];
    user.hours = user.hours + ( 0.5 / this.state.pointsRate );
    users[id] = user;
    this.setState({ users : users });
  },

  handleWorkerPointsDownChange(id) {
    let users = this.state.users
    let user = users[id];
    user.hours = user.hours - ( 0.5 / this.state.pointsRate );
    users[id] = user;
    this.setState({ users : users });
  },

  handleWorkerChange(id) {
    let users = this.state.users
    let user = users[id];
    user.hours = parseFloat(this.refs[id + "-points"].getValue(), 10) / this.state.pointsRate;
    user.reason = this.refs[id + "-reason"].getValue();
    users[id] = user;
    this.setState({ users : users });
  },

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ isSubmitting: true });
    let usersToUpdate = {};
    for (let id of Object.keys(this.state.users)) {
      let user = this.state.users[id];
      usersToUpdate[id] = {
        points : user.hours * this.state.pointsRate,
        reason: user.reason,
      };
    };

    let waitCount = 2;
    let doneCount = 0;
    function done (err) {
      if (err) {
        console.log("AdminEventPointsAttributionDone", err); return;
      }
      ++doneCount;
      if (doneCount === waitCount) {
        this.setState({ isSubmitting: false });
        this.context.router.transitionTo("/");
      }
    }
    UserStore.batchAwardPoints({ users: usersToUpdate }, done.bind(this));
    this.context.flux.getActions("event")
      .markEventAsPointsAttributed(this.state.schedule.event)
      .then(event => done.call(this, null));
  },

  renderTaskList(tasks) {
    const taskList = Object.keys(tasks).map((task) => {
      return (<li>{task} ({tasks[task]})</li>);
    });
    return <ul>{taskList}</ul>
  },

  renderScheduledUsers() {
    let users = this.state.users;
    return Object.keys(users).map((id) => {
      let user = users[id];
      let boundOnChange = this.handleWorkerChange.bind(this, id);
      let boundUpClick = this.handleWorkerPointsUpChange.bind(this, id);
      let boundDownClick = this.handleWorkerPointsDownChange.bind(this, id);

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
    });
  },

  renderTableHeader () {
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

  renderSubmitButton () {
    return (
      <Button type="submit" disabled={this.state.isSubmitting} bsStyle="success">
        {this.state.isSubmitting ? "En cours...": "Attribuer les points"}
      </Button>
    );
  },

  renderUserList () {
    return (
      <div className="worker-list">
        <h3>Travailleurs pour l'événement {this.state.schedule.event.name}</h3>
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
          {this.renderSubmitButton()}
        </form>
      </div>
    );
  },

  renderWaiting () {
    return (
      <div className="waiting">
        <h3>Horaire</h3>
        <div>Chargement en cours...</div>
      </div>
    );
  },

  render () {
    return (
      <div className="event-points-wrapper">
        {this.state.schedule && this.state.users ? this.renderUserList() : this.renderWaiting()}
      </div>
    );
  },

});

export default AdminEventPointsAttribution;
