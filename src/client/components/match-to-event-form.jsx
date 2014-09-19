/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Input = require("react-bootstrap/Input");
var Row = require("react-bootstrap/Row");
var Col = require("react-bootstrap/Col");

var dateHelper = require("../middlewares/date");

module.exports = React.createClass({
  displayName: "MatchToEventForm",
  propTypes: {
    event: PropTypes.shape({
      name: PropTypes.string,
      startDate: PropTypes.instanceOf(Date),
      endDate: PropTypes.instanceOf(Date),
      tasks: PropTypes.arrayOf(PropTypes.string),
      wildcardTask: PropTypes.string,
    }).isRequired,
    applications: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        user: PropTypes.string.isRequired,
        tasks: PropTypes.arrayOf(PropTypes.shape({
          first: PropTypes.string,
          second: PropTypes.string,
          third: PropTypes.string,
        })).isRequired,
        availabilities: PropTypes.arrayOf(
          PropTypes.instanceOf(Date)
        ).isRequired,
    })).isRequired,
    users: PropTypes.objectOf(
      PropTypes.shape({
        uid: PropTypes.string.isRequired,
      })
    ).isRequired
  },
  renderSelectBox: function (task, users) {
    var options = users.map(function (user, index) {
      return (<option key={user.uid} value={user.uid}>{user.totalPoints || 0} - {user.name}</option>);
    });
    return (
      <Col xs={6} md={4}>
        <Input key={task} type="select" multiple label={task}>
          {options}
        </Input>
      </Col>
    );
  },
  renderHours: function () {
    // @HACK
    var users = [];
    Object.keys(this.props.users).forEach(function (key, i) {
      users.push(this.props.users[key]);
    },this);
    // @END
    var tasks = this.props.event.tasks.filter(function (task) {
      return task != this.props.event.wildcardTask;
    }, this);

    var currDate = dateHelper.clone(this.props.event.startDate);
    var rows = [];
    while(currDate.getTime() < this.props.event.endDate.getTime()) {
      var key = currDate.getTime();
      var row = [];
      for (var i = 0; i < tasks.length; ++i) {
          // @HACK user
          row.push(this.renderSelectBox(tasks[i], users));
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
  render: function () {
    return (
      <form>
        {this.renderHours()}
        <div>DEBUG</div>
        <div>{JSON.stringify(this.props.applications)}</div>
        <div>{JSON.stringify(this.props.users)}</div>
      </form>
    );
  }
});
