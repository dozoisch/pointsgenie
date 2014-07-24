/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Row = require("react-bootstrap/Row");
var Col = require("react-bootstrap/Col");
var Input = require("react-bootstrap/Input");

var dateHelper = require("../../middlewares/date");

module.exports = React.createClass({
  displayName: "ApplicationDisponibility",
  propTypes: {
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    onChange: PropTypes.func.isRequired,
  },
  getFormData: function () {
    var data = [];
    var splitRegex = /^([0-9]{1,2})-([0-9]{1,2})$/;
    Object.keys(refs).forEach(function (key) {
      if(refs[key].getChecked()) {
        data.push(new Date(key));
      }
    });
    return data;
  },
  isValid: function () {
    var refs = this.refs;
    Object.keys(refs).forEach(function (key) {
      if(refs[key].getChecked()) {
        return true;
      }
    });
    return false;
  },
  renderMessage: function () {
    if(!this.isValid()) {
      return (
        <Alert bsStyle="danger">
          Au moins une heure de disponibilité doit être sélectionnée!
        </Alert>
      );
    }
    return null;
  },
  render: function () {
    var currDate = dateHelper.clone(this.props.startDate);
    var checkboxes = [];
    while(currDate.getTime() < this.props.endDate.getTime()) {
      var key = currDate.getTime();
      checkboxes.push(
        <Col md={1} key={key}>
          <Input type="checkbox" ref={key}
            label={currDate.getDate() + " à " + currDate.getHours() + "h"}
            onChange={this.props.onChange}
          />
        </Col>
      );
      currDate = dateHelper.addHours(currDate, 1);
    }
    return (
      <div>
        {this.renderMessage()}
        <Row>
          {checkboxes}
        </Row>
      </div>
    );

  }
});
