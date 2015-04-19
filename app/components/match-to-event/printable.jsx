"use strict";
import React, { PropTypes } from "react";
import { Table } from "react-bootstrap";

var dateHelper = require("../../middlewares/date");

module.exports = React.createClass({
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
      if (select.selectedIndex !== -1) {
        for (var i = select.selectedIndex; i < options.length; ++i) {
          if (options[i].selected) {
            data[time][task].push(options[i].value);
          }
        }
      }
    }, this);

    return data;
  },
  renderSelectBox: function (task, users, time) {
    var options = users.map(function (user, index) {
      return (
        <li className={user.preferenceClassName} key={user.id}>
          {user.totalPoints || 0} - {user.name || user.cip}
        </li>
      );
    }, this);
    return (
      <td key={task}>
          <ul>{options}</ul>
      </td>
    );
  },
  renderHours: function () {
    var tasks = this.props.event.tasks;

    var currDate = dateHelper.clone(this.props.event.startDate);
    var rows = [];
    while(currDate.getTime() < this.props.event.endDate.getTime()) {
      var key = currDate.getTime();
      var row = [];

      row.push(<td>{currDate.toLocaleString()}</td>);

      for (var i = 0; i < tasks.length; ++i) {
        var users = this.props.getHourTaskUserList(currDate.toISOString(), tasks[i]);
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
  renderHeader: function () {
    var headers = this.props.event.tasks.map(function (task) {
      return (<th>{task}</th>);
    });
    headers.unshift(<th>Heures</th>);
    return (<thead><tr>{headers}</tr></thead>);
  },
  render: function () {
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
