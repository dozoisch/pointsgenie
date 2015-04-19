"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Input = require("react-bootstrap/Input");
var Row = require("react-bootstrap/Row");
var Col = require("react-bootstrap/Col");
var Button = require("react-bootstrap/Button");

var dateHelper = require("../../middlewares/date");

module.exports = React.createClass({
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
        <option className={user.preferenceClassName} key={user.id} value={user.id}>
          {user.totalPoints || 0} - {user.name || user.cip}
        </option>
      );
    }, this);
    return (
      <Col xs={6} md={4} key={task}>
        <Input type="select" multiple label={task} ref={time + "-" + task} time={time} task={task}>
          {options}
        </Input>
      </Col>
    );
  },
  renderHours: function () {
    var tasks = this.props.event.tasks;

    var currDate = dateHelper.clone(this.props.event.startDate);
    var rows = [];
    while(currDate.getTime() < this.props.event.endDate.getTime()) {
      var key = currDate.getTime();
      var row = [];
      for (var i = 0; i < tasks.length; ++i) {
        var users = this.props.getHourTaskUserList(currDate.toISOString(), tasks[i]);
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
