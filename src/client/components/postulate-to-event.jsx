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
  displayName: "PostulateToEvent",
  getInitialState: function() {
    return {};
  },
  propTypes: {
    event: PropTypes.shape({
      name: PropTypes.string.isRequired,
      startDate: PropTypes.instanceOf(Date).isRequired,
      endDate: PropTypes.instanceOf(Date).isRequired,
      roles: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
  },
  validateForm: function () {
    this.setState({validates: false});
  },
  handleSubmit: function (e) {
    e.preventDefault();
    this.setState({isSubmitting: true});
  },
  renderRoleSelects: function () {
    var selectsInfo = [
      { ref: "firstChoice", label:"Premier choix" },
      { ref: "secondChoice", label: "Deuxième choix" },
      { ref: "thirdChoice", label: "Troisième choix" },
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
        <Col md={1}>
          <Input type="checkbox" ref={key} key={key} label={currDate.getHours() + "h"}/>
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
      <div className="postulate-event">
        <h3>Postuler pour {this.props.event.name} ({this.props.event.startDate.toLocaleDateString()})</h3>
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
      </div>
    );
  }
});
