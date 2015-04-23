"use strict";
import React, { PropTypes } from "react";

import MatchToEventWrapper from "../components/match-to-event/wrapper";
import EventStore from "../stores/event";
import request from "../middlewares/request";

const AdminMatchToEvent = React.createClass({
  displayName: "AdminMatchToEvent",

  contextTypes: {
    router: PropTypes.func
  },

  getInitialState() {
    return {
       event : EventStore.getEvent(this.context.router.getCurrentParams().id),
    };
  },

  componentWillMount () {
    EventStore.init();
  },

  componentDidMount () {
    EventStore.addChangeListener(this.updateEvent);
    const url = `/events/${this.context.router.getCurrentParams().id}/applications`;
    request.get(url, (err, res) => {
      if (err || res.status !== 200 || !res.body || !res.body.users || !res.body.applications) return; // @TODO Error handling

      // map the users
      let users = {};
      let resUsers = res.body.users;
      for (let i = 0; i < resUsers.length; ++i) {
        users[resUsers[i].id] = resUsers[i];
      }

      this.setState({
        applications: res.body.applications,
        users: users,
      });
    });
  },

  componentWillUnmount() {
    EventStore.removeChangeListener(this.updateEvent);
  },

  updateEvent() {
    if(!this.isMounted()) {
      return;
    }
    this.setState({
      event: EventStore.getEvent(this.context.router.getCurrentParams().id),
    });
  },

  onSubmit(e) {
    e.preventDefault();
    let data = this.refs.form.getFormData();
    let url = `/schedules/${this.context.router.getCurrentParams().id}`;
    request.post(url, { hours: data }, (err, res) => {
      if (err || res.status !== 200) { return;  } // @TODO error handling

      // The event got closed... we need to tell the store to update it...
      EventStore.refreshEvent(this.state.event.id);
      this.context.router.transitionTo("/"); // @TODO better handling
    });
  },

  renderForm() {
    if (this.state.event) {
      if (this.state.event.isClosed) {
        return (<div>L'événement est déjà fermé</div>);
      } else if (this.state.applications) {
        return (
          <MatchToEventWrapper ref="form" event={this.state.event} applications={this.state.applications}
            users={this.state.users} onSubmit={this.onSubmit} />
        );
      }
    }
    return (
      <div>Chargement en cours...</div>
    );
  },

  render() {
    return (
      <div className="match-to-event">
        <h3>Attribuer les tâches pour {this.state.event ? this.state.event.name : "..."}</h3>
        {this.renderForm()}
      </div>
    );
  }
})

export default AdminMatchToEvent;
