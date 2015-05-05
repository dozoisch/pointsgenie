import React, { Component, PropTypes } from "react";
import { Button, Glyphicon } from "react-bootstrap";
import connectToStore from "flummox/connect";

import MatchToEventWrapper from "../components/match-to-event/wrapper";
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

  handleSubmit(e) {
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

  handleToggleCloseToPublic() {
    this.context.flux.getActions("event").toggleIsClosedToPublic(this.props.event);
  },

  render() {
    if (!this.props.event) {
      return (
        <div>Chargement en cours...</div>
      );
    }
    const glyph = this.props.event.isClosedToPublic ?
      (<Glyphicon glyph="lock" title="L'événement est fermé à la postulation"/>) :
      null;
    return (
      <div className="match-to-event">
        <h3>Attribuer les tâches pour {this.props.event.name}{glyph}</h3>
        {this.renderIsCloseToggleButton()}
        {this.renderForm()}
      </div>
    );
  },

  renderForm() {
    if (this.props.event.isClosed) {
      return (<div>L'événement est déjà fermé</div>);
    } else if (this.state.applications) {
      return (
        <MatchToEventWrapper ref="form" event={this.props.event} applications={this.state.applications}
          users={this.state.users} onSubmit={this.handleSubmit} />
      );
    }
  },

  renderIsCloseToggleButton() {
    const { event } = this.props;
    const label = event.isClosedToPublic ? "Réouvrir l'événement" : "Fermer l'événement";
    const bsStyle = event.isClosedToPublic ? "default" : "primary";
    return (
      <Button className="toggle-close" bsStyle={bsStyle} onClick={this.handleToggleCloseToPublic}>{label}</Button>
    );
  },
});

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
