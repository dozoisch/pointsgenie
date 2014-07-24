/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Input = require("react-bootstrap/Input");
var PostulateForm = require("./postulate-to-event-form");

var dateHelper = require("../middlewares/date");

module.exports = React.createClass({
  displayName: "PostulateToEvent",
  propTypes: {
    eventList: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        startDate: PropTypes.instanceOf(Date).isRequired,
        endDate: PropTypes.instanceOf(Date).isRequired,
        roles: PropTypes.arrayOf(PropTypes.string).isRequired,
      })
    ).isRequired,
    defaultSelectedEventIndex: PropTypes.number,
    onFormSubmit: PropTypes.func
  },
  getDefaultProps: function () {
    return {
      defaultSelectedEventIndex: 0,
      onFormSubmit: function () {},
    };
  },
  getInitialState: function () {
    return { selectedEventIndex: this.props.defaultSelectedEventIndex };
  },
  onSubmit: function (err, res) {
    if (err) {
      this.setState({style: "danger", message: "Erreur non-controlée: " + err.message});
    } else if (res.status === 200) {
      this.setState({style: "success", message: "Postulance acceptée!"});
    } else {
      this.setState({style: "danger", message: res.body.error});
    }
    this.props.onFormSubmit(err, res);
  },
  handleDropdownChange : function () {
    if(this.props.eventList.length === 0) {
      return;
    }
    this.setState({ selectedEventIndex: this.refs.eventSelect.getDOMNode().value});
  },
  renderMessage: function () {
    if(this.state.alert) {
      return (
        <Alert bsStyle={this.state.alert.style} onDismiss={this.handleAlertDismiss}>
          {this.state.alert.message}
        </Alert>
      );
    }
    return null;
  },
  renderEventList: function () {
    if(this.props.eventList.length === 0) {
      return (<p>Il n'y a aucun événement de prévu.</p>);
    }
    var options = this.props.eventList.map(function (entry, index) {
      return (<option value={index} key={entry.id}>
        {entry.name} ({entry.startDate.toLocaleDateString()})
        </option>);
    });
    return (
      <span>Postuler pour
        <select ref="eventSelect" type="select" onChange={this.handleDropdownChange}
          className="form-control postulate-event-selector" value={this.state.selectedEventIndex}
        >
          {options}
        </select>
      </span>
    );
  },
  renderForm: function () {
    if(this.props.eventList.length === 0) {
      return (null);
    }
    return (<PostulateForm event={this.props.eventList[this.state.selectedEventIndex]} />);
  },
  render: function() {

    return (
      <div className="postulate-event">
        <h3>Postuler pour un événement</h3>
        {this.renderEventList()}
        {this.renderMessage()}
        {this.renderForm()}
      </div>
    );
  }
});
