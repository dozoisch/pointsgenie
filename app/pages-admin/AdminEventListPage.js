import React, { PropTypes } from "react";
import { RouteHandler, Link } from "react-router/build/npm/lib";
import { Table, Glyphicon } from "react-bootstrap";
import { sortByOrder as _sortByOrder } from "lodash"

import connectToStore from "flummox/connect";

const AdminEventList = React.createClass({
  displayName: "AdminEventList",

  contextTypes: {
    flux: PropTypes.object,
  },

  renderLegend() {
    // @TODO: dont hardcode the status + messages!
    return (
      <ul>
        <li>
          <Glyphicon glyph="lock" /> : Événement fermé. L'événement n'est plus accessible pour postuler
        </li>
        <li>
          <Glyphicon glyph="ok" /> : Points attribués. Les points ont été attribué pour l'événement
        </li>
      </ul>
    );
  },

  renderUpdateEventLink(event) {
    if (event.isClosed) {
      return event.name;
    } else {
      return (<Link to="edit-event" params={{id:event.id}}>{event.name}</Link>);
    }
  },

  renderMatchToEventLink(event) {
    if (event.isClosed) {
      return undefined;
    } else {
      return (<li><Link to="match-to-event" params={{id:event.id}}>Attribuer les postes</Link></li>);
    }
  },

  renderEventScheduleLink(event) {
    if (event.isClosed) {
      return (<li><Link to="event-schedule" params={{id:event.id}}>Voir l'horaire</Link></li>);
    } else {
      return undefined;
    }
  },

  renderAttributePointsLink(event) {
    if (event.isClosed && !event.isPointsAttributed) {
      return (<li><Link to="event-attribution" params={{id:event.id}}>Attribuer les points</Link></li>);
    } else {
      return undefined;
    }
  },

  renderEventList() {
    let rows = [];
    if (this.props.events.length === 0) {
      rows.push(<tr key="emptyTable"><td colSpan="5">Aucun événement</td></tr>);
    } else {
      const events  = _sortByOrder(this.props.events, "startDate", false);
      rows = events.map((event) => {
        return (
          <tr key={event.id}>
            <td className="icons">
              {event.isPointsAttributed ? (<Glyphicon glyph="ok" title="Points attribués" />) : null}
              {event.isClosed || event.isClosedToPublic ? (<Glyphicon glyph="lock" title="Événement fermé" />) : null}
            </td>
            <td>{this.renderUpdateEventLink(event)}</td>
            <td>{event.startDate.toLocaleString()}</td>
            <td>{event.endDate.toLocaleString()}</td>
            <td><ul>
              {this.renderMatchToEventLink(event)}
              {this.renderEventScheduleLink(event)}
              {this.renderAttributePointsLink(event)}
            </ul></td>
          </tr>
        );
      });
    }
    return rows;

  },

  render() {
    return (
      <div className="event-list">
        <h3>Événements</h3>
        <Table bordered hover responsive striped>
          <thead>
            <tr>
              <th>État</th>
              <th>Nom</th>
              <th>Début</th>
              <th>Fin</th>
              <th>{/* Actions */}</th>
            </tr>
          </thead>
          <tbody>
            {this.renderEventList()}
          </tbody>
        </Table>
        {this.renderLegend()}
      </div>
    );
  },
});

const ConnectedEventList = connectToStore(AdminEventList, {
  event: store => ({
    events: store.getAllEvents(),
  })
});

export default ConnectedEventList;
