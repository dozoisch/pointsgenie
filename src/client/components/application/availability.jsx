/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Row = require("react-bootstrap/Row");
var Col = require("react-bootstrap/Col");
var Input = require("react-bootstrap/Input");
var Alert = require("react-bootstrap/Alert");

var dateHelper = require("../../middlewares/date");

module.exports = React.createClass({
  displayName: "ApplicationAvailability",
  propTypes: {
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    onChange: PropTypes.func.isRequired,
  },
  getFormData: function () {
    var data = [];
    var refs = this.refs;
    Object.keys(refs).forEach(function (key) {
      if(refs[key].getChecked()) {
        data.push(new Date(key));
      }
    });
    return data;
  },
  isValid: function () {
    var refs = this.refs;

    for (var key in refs) {
      if(refs[key].getChecked()) {
        return true;
      }
    }
    return false;
  },
  createCheckboxes: function () {
    var currDate = dateHelper.clone(this.props.startDate);
    var checkboxes = {};
    while(currDate.getTime() < this.props.endDate.getTime()) {
      var key = currDate.getTime();
      checkboxes[currDate.getDate()] = checkboxes[currDate.getDate()] || [];
      checkboxes[currDate.getDate()].push(
        <Col md={1} xs={2} key={key}>
          <Input type="checkbox" ref={key}
            label={currDate.getHours() + "h"}
            onChange={this.props.onChange}
          />
        </Col>
      );
      currDate = dateHelper.addHours(currDate, 1);
    }
    return checkboxes;
  },
  renderCheckboxes: function () {
    var checkboxes = this.createCheckboxes();
    var rows = [];
    Object.keys(checkboxes).forEach(function (key) {
      rows.push(
        <div key={key}>
          <div> Le {key}</div>
          <Row>
            {checkboxes[key]}
          </Row>
        </div>
      );
    });
    return <div>{rows}</div>
  },
  render: function () {
    var valid = this.isValid();
    return (
      <Input bsStyle={valid? null: "error" } wrapperClassName="wrapper"
        help={valid ? null :  "Au moins une heure de disponibilité doit être sélectionnée!"}
      >
        {this.renderCheckboxes()}
      </Input>
    );

  }
});
