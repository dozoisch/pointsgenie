/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;

var MatchingForm = require("../components/match-to-event-form");
var EventStore = require("../stores/event");
var request = require("../middlewares/request");

var Navigation = require("react-router").Navigation;

module.exports = React.createClass({
  displayName: "AdminMatchToEvent",
  mixins: [Navigation],
  propTypes: {},
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
        users[resUsers[i].id] = resUsers[i];
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
  onSubmit: function (e) {
    e.preventDefault();
    var data = this.refs.form.getFormData();
    var url = "/schedules/" + this.props.params.id;
    request.post(url, { hours: data }, function (err, res) {
      if (res.status !== 200) return; // @TODO error handling

      // The event got closed... we need to tell the store to update it...
      EventStore.fetchAll(); // @TODO optimize this
      this.transitionTo("/"); // @TODO better handling
    }.bind(this));
  },
  renderForm: function () {
    if (this.state.event.isClosed) {
      return <div>L'événement est déjà fermé</div>
    } else if (this.state.event && this.state.applications) {
      return (
        <MatchingForm ref="form" event={this.state.event} applications={this.state.applications}
          users={this.state.users} onSubmit={this.onSubmit} />
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
        <h3>Attribuer les tâches pour {this.state.event.name}</h3>
        {this.renderForm()}
      </div>
    );
  }
})
