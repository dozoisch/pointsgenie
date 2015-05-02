import React, { Component, PropTypes } from "react";

import MatchToEventWrapper from "../components/match-to-event/wrapper";
import connectToStore from "flummox/connect";
import request from "../middlewares/request";

const AdminMatchToEvent = React.createClass({
  displayName: "AdminMatchToEvent",

  contextTypes: {
    router: PropTypes.func,
    flux: PropTypes.object,
  },

  getInitialState() {
    return {};
  },

  componentDidMount () {
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

  onSubmit(e) {
    e.preventDefault();
    let data = this.refs.form.getFormData();
    const { id } = this.context.router.getCurrentParams();
    let url = `/schedules/${id}`;
    request.post(url, { hours: data }, (err, res) => {
      if (err || res.status !== 200) { return;  } // @TODO error handling

      // The event got closed... we need to tell the store to update it...
      this.context.flux.getActions("event").fetchEvent(id)
        .then(() => this.context.router.transitionTo("/"));
      // @TODO better handling
    });
  },

  renderForm() {
    if (this.props.event) {
      if (this.props.event.isClosed) {
        return (<div>L'événement est déjà fermé</div>);
      } else if (this.state.applications) {
        return (
          <MatchToEventWrapper ref="form" event={this.props.event} applications={this.state.applications}
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
        <h3>Attribuer les tâches pour {this.props.event ? this.props.event.name : "..."}</h3>
        {this.renderForm()}
      </div>
    );
  }
})

const ConnectedMatchToEvent = connectToStore(AdminMatchToEvent, {
  event: (store, props) => {
    if (props.eventId === undefined) {
      return {};
    }
    return {
      event: store.getEvent(props.eventId),
    };
  }
});

class WrappedMatchToEvent extends Component {
  static contextTypes = {
    router: PropTypes.func,
  }

  render() {
    const { id } = this.context.router.getCurrentParams();
    return (<ConnectedMatchToEvent {...this.props} eventId={id} />);
  }
}

export default WrappedMatchToEvent;
