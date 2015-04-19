"use strict";
import React, { PropTypes } from "react";
import { Table } from "react-bootstrap";

import dateHelper from "../../middlewares/date";

const MatchToEventPrintable = React.createClass({
  displayName: "MatchToEventPrintable",

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
      data[time][task] = [];
      // Thanks to IE 10-11 that do not support .selectedOptions...
      let select = this.refs[elem].getInputDOMNode();
      let options = select.options;
      if (select.selectedIndex !== -1) {
        for (let i = select.selectedIndex; i < options.length; ++i) {
          if (options[i].selected) {
            data[time][task].push(options[i].value);
          }
        }
      }
    };

    return data;
  },
  renderSelectBox(task, users, time) {
    let options = users.map((user, index) => {
      return (
        <li className={user.preferenceClassName} key={user.id}>
          {user.totalPoints || 0} - {user.name || user.cip}
        </li>
      );
    });
    return (
      <td key={task}>
          <ul>{options}</ul>
      </td>
    );
  },
  renderHours() {
    let tasks = this.props.event.tasks;

    let currDate = dateHelper.clone(this.props.event.startDate);
    let rows = [];
    while(currDate.getTime() < this.props.event.endDate.getTime()) {
      let key = currDate.getTime();
      let row = [];

      row.push(<td>{currDate.toLocaleString()}</td>);

      for (let i = 0; i < tasks.length; ++i) {
        let users = this.props.getHourTaskUserList(currDate.toISOString(), tasks[i]);
        row.push(this.renderSelectBox(tasks[i], users, key));
      }
      rows.push(
          <tr>{row}</tr>
      );

      // Get next hour
      currDate = dateHelper.addHours(currDate, 1);
    }
    return <tbody>{rows}</tbody>;
  },

  renderHeader() {
    console.log(this.props.event);
    let headers = this.props.event.tasks.map((task) => {
      return (<th>{task}</th>);
    });
    headers.unshift(<th>Heures</th>);
    console.log("headers", headers.length);
    return (<thead><tr>{headers}</tr></thead>);
  },

  render() {
    console.log("herp");
    return (
      <div className="printable-content">
        <Table bordered hover responsive striped>
          {this.renderHeader()}
          {this.renderHours()}
        </Table>
      </div>
    );
  }
});

export default MatchToEventPrintable;
