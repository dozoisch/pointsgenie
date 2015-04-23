"use strict";
import React, { PropTypes } from "react";
import { Input, Col, Row, Button } from "react-bootstrap";

import dateHelper from "../../middlewares/date";

const MatchToEventForm = React.createClass({
  displayName: "MatchToEventForm",
  propTypes: {
    onSubmit: PropTypes.func.isRequired,
    getHourTaskUserList: PropTypes.func,
    event: PropTypes.shape({
      name: PropTypes.string,
      startDate: PropTypes.instanceOf(Date),
      endDate: PropTypes.instanceOf(Date),
      tasks: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    isSubmitting: PropTypes.bool,
  },

  getFormData() {
    let data = {};
    for (let elem of Object.keys(this.refs)) {
      let index = elem.indexOf("-");
      let time = elem.substring(0, index);
      let task = elem.substring(index + 1);
      data[time] = data[time] || {};
      data[time][task] = this.refs[elem].getValue();
    };

    return data;
  },

  renderSelectBox(task, users, time) {
    let options = users.map((user, index) => {
      return (
        <option className={user.preferenceClassName} key={user.id} value={user.id}>
          {user.totalPoints || 0} - {user.name || user.cip}
        </option>
      );
    });
    return (
      <Col xs={6} md={4} key={task}>
        <Input type="select" multiple label={task} ref={time + "-" + task} time={time} task={task}>
          {options}
        </Input>
      </Col>
    );
  },

  renderHours() {
    let tasks = this.props.event.tasks;
    let currDate = dateHelper.clone(this.props.event.startDate);
    let rows = [];
    while(currDate.getTime() < this.props.event.endDate.getTime()) {
      let key = currDate.getTime();
      let row = [];
      for (let i = 0; i < tasks.length; ++i) {
        let users = this.props.getHourTaskUserList(currDate.toISOString(), tasks[i]);
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

  renderSubmitButton() {
    return (
      <Button type="submit" disabled={this.props.isSubmitting} bsStyle="success">
        { this.props.isSubmitting ? "En cours...": "Attribuer les tâches" }
      </Button>
    );
  },

  render() {
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

export default MatchToEventForm;
