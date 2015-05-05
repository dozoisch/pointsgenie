import React, { PropTypes } from "react";
import { Table, Glyphicon, ModalTrigger } from "react-bootstrap";
import connectToStore from "flummox/connect";

import ApplicationModal from "../components/ApplicationModal";

function preventDefaultClick(e) {
  e.preventDefault();
}

const ApplicationsPage = React.createClass({
  displayName: "ApplicationsPage",

  propTypes: {
    user: PropTypes.object,
  },

  render() {
    const user = this.props.user || {};
    return (
      <div className="applications-page">
        <h3>Historique des postulations</h3>
        <Table responsive striped >
          <thead>{this.renderApplicationTableHeader()}</thead>
          <tbody>{this.renderApplicationTableBody()}</tbody>
        </Table>
      </div>
    );
  },

  renderApplicationTableHeader() {
    return (
      <tr>
        <th></th>
        <th>Événement</th>
        <th>Tâche préférée</th>
        <th>Date</th>
      </tr>
    );
  },

  renderApplicationTableBody() {
    return this.props.applications.reverse().map(application => {
      const event = this.props.events[application.event];
      return (
        <tr>
          <td className="icons">
            {this.renderClosedGlyph(event)}
            {this.renderPointsAttributedGlyph(event)}
          </td>
          <td>{this.renderEditApplicationLink(event, application)}</td>
          <td>{application.preferredTask || "(Toutes)" }</td>
          <td title={event.startDate.toTimeString()}>{event.startDate.toLocaleDateString()}</td>
        </tr>
      );
    });
  },

  renderClosedGlyph(event) {
    return event.isClosed || event.isClosedToPublic ?
      (<Glyphicon glyph="lock" title="Événement fermé" />) :
      null;
  },

  renderPointsAttributedGlyph(event) {
    return event.isPointsAttributed ?
      (<Glyphicon glyph="ok" title="Points attribués" />) :
      null;
  },

  renderEditApplicationLink(event, application) {
    const modal = (
      <ApplicationModal application={application} event={event} readOnly={event.isClosed || event.isClosedToPublic} />
    );
    return (
      <ModalTrigger modal={modal}>
        <a href="#" onClick={preventDefaultClick}>{event.name}</a>
      </ModalTrigger>
    );
  },

});

const ConnectedAplication = connectToStore(ApplicationsPage, {
  auth: store => ({
    user: store.getAuthenticatedUser(),
  }),
  application: store => ({
    applications: store.getUserApplications(),
  }),
  event: (store, props) => ({
    events: store.getEvents(props.eventIds),
  }),
});
const ConnectedWrapper = connectToStore(ConnectedAplication, {
  application: store => ({
    eventIds: store.getUserApplicationEventIds(),
  }),
});

export default ConnectedWrapper;
