/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Input = require("react-bootstrap/Input");
var Button = require("react-bootstrap/Button");
var Row = require("react-bootstrap/Row");
var Col = require("react-bootstrap/Col");
var dateHelper = require("../middlewares/date");

module.exports = React.createClass({
  displayName: "PostulateToEventForm",
  propTypes: {
    event: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      startDate: PropTypes.instanceOf(Date).isRequired,
      endDate: PropTypes.instanceOf(Date).isRequired,
      roles: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
  },
  getInitialState: function() {
    return {};
  },
  validateForm: function () {
    var validates = false;
    var refs = this.refs;
    Object.keys(refs).forEach(function (key) {
      if(key.match(/^hours-/) && refs[key].isCheckboxOrRadio() && refs[key].getChecked()) {
        validates = true;
      }
    });
    this.setState({validates: validates});
  },
  handleSubmit: function (e) {
    e.preventDefault();
    this.setState({isSubmitting: true});
    var data = { roles: {}, hours: {}};
    var refs = this.refs;
    var splitRegex = /^(hours|roles)-([0-9]+)$/;
    Object.keys(refs).forEach(function (key) {
      var match = splitRegex.exec(key);
      data[match[1]][match[2]] = refs[key].isCheckboxOrRadio() ? refs[key].getChecked() : refs[key].getValue();
    });
    var url = "/event/" + this.props.event.id + "/postulate";
    // request.post(url, formData, function (err, res) {
    // });
  },
  renderRoleSelects: function () {
    var selectsInfo = [
      { ref: "1", label: "Premier choix" },
      { ref: "2", label: "Deuxième choix" },
      { ref: "3", label: "Troisième choix" },
    ];
    return selectsInfo.map(function (selectEntry, selectIndex) {
      var options = this.props.event.roles.map(function (optionEntry, optionIndex) {
        return (<option key={selectEntry.ref + optionIndex}>{optionEntry}</option>);
      });
      var key = "roles-" + selectEntry.ref;
      return (
        <Col md={4} key={key}>
          <Input type="select" ref={key} label={selectEntry.label}>
            {options}
          </Input>
        </Col>
        );
    }, this);
  },
  renderHourCheckboxes: function () {
    var currDate = dateHelper.clone(this.props.event.startDate);
    var checkboxes = [];
    while(currDate.getTime() < this.props.event.endDate.getTime()) {
      var key = "hours-" + currDate.getUTCHours();
      checkboxes.push(
        <Col md={1} key={key}>
          <Input type="checkbox" ref={key} onChange={this.validateForm}
           label={currDate.getHours() + "h"} />
        </Col>
      );
      currDate = dateHelper.addHours(currDate, 1);
    }
    return checkboxes;
  },
  renderSubmitButton: function () {
    var disabled = !this.state.validates || this.state.isSubmitting;
    return (
      <Button type="submit" disabled={disabled} bsStyle="success">
        {this.state.isSubmitting ? "Enregistrement en cours...": "Postuler"}
      </Button>
    );
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit} role="form">
        <fieldset>
          <h4>Postes demandés</h4>
          <Row>
            {this.renderRoleSelects()}
          </Row>
          <h4>Disponibilités</h4>
          <Row>
            {this.renderHourCheckboxes()}
          </Row>
        {this.renderSubmitButton()}
        </fieldset>
      </form>
    );
  }
});
