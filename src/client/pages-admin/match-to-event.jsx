/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;

var MatchingForm = require("../components/match-to-event-form");
var EventStore = require("../stores/event");
var request = require("../middlewares/request");


module.exports = React.createClass({
  displayName: "AdminMatchToEvent",
  propTypes: {
  },
  getInitialState: function() {
    return {
       event : EventStore.getEvent(this.props.params.id),
    };
  },
  componentWillMount: function () {
    EventStore.init();
  },
  componentDidMount: function () {
    EventStore.addChangeListener(this.updateEvent);
    var url = "/events/" + this.props.params.id + "/applications";
    request.get(url, function (err, res) {
      if (res.status !== 200 || !res.body || !res.body.users || !res.body.applications) return; // @TODO Error handling

      // map the users
      var users = {};
      var resUsers = res.body.users;
      for (var i = 0; i < resUsers.length; ++i) {
        users[resUsers[i].cip] = resUsers[i];
      }

      this.setState({
        applications: res.body.applications,
        users: users,
      });
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
    if (this.state.event.isClosed) {
      return <div>L'événement est déjà fermé</div>
    } else if (this.state.event && this.state.applications) {
      return (
        <MatchingForm event={this.state.event} applications={this.state.applications} users={this.state.users} />
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
