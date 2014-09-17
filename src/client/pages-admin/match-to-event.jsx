/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;

var MatchingForm = require("../components/match-to-event-form");

module.exports = React.createClass({
  displayName: "AdminMatchToEvent",
  propTypes: {
  },
  getInitialState: function() {
    return {};
  },
  componentWillMount: function () {
    EventStore.init();
  },
  componentDidMount: function () {
    EventStore.addChangeListener(this.updateEvent);
    var url = "/events/" + this.props.params.id + "/applications";
    request.get(url, function (err, res) {
      if (res.status !== 200) return; // @TODO Error handling
      this.setState({applications: res.body.applications});
    }.bind(this));
  },
  componentWillUnmount: function() {
    EventStore.removeChangeListener(this.updateEvent);
  },
  updateEvent: function () {
    if(!this.isMounted()) {
      return;
    }
    this.setState({
      event: EventStore.getEvent(this.props.params.id),
    });
  },
  renderForm: function () {
    if (this.state.event && this.state.applications) {
      return (
        <MatchingForm event={this.state.event} applications={this.state.applications} />
      );
    } else {
      return (
        <div>Chargement en cours...</div>
      );
    }
  },
  render: function () {
    return (
      <div className="match-to-event">
        {this.renderForm()}
      </div>
    );
  }
})
