/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Link = require("react-router").Link;
var Table = require("react-bootstrap/Table");
var Glyphicon = require("react-bootstrap/Glyphicon");

var EventStore = require("../stores/event");

module.exports = React.createClass({
  displayName: "AdminEventList",
  getInitialState: function() {
    return {
      events: EventStore.getEvents(),
    };
  },
  componentWillMount: function () {
    EventStore.init();
  },
  componentDidMount: function () {
    EventStore.addChangeListener(this.updateEvents);
  },
  componentWillUnmount: function() {
    EventStore.removeChangeListener(this.updateEvents);
  },
  updateEvents: function () {
    if(!this.isMounted()) {
      return;
    }
    this.setState({
      events: EventStore.getEvents(),
    });
  },
  renderLegend: function (event) {
    // @TODO: dont hardcode the statuc + messages!
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
  renderMatchToEventLink: function (event) {
    if (event.isClosed) {
      return undefined;
    } else {
      return (<li><Link to="match-to-event" params={{id:event.id}}>Attribuer les postes</Link></li>);
    }
  },
  renderEventScheduleLink: function (event) {
    if (event.isClosed) {
      return (<li><Link to="event-schedule" params={{id:event.id}}>Voir l'horaire</Link></li>);
    } else {
      return undefined;
    }
  },
  renderEventList: function () {
    var rows = [];
    if(this.state.events.length === 0) {
      rows.push(<tr key="emptyTable"><td colSpan="5">Aucun événement</td></tr>);
    } else {
      rows = this.state.events.map(function (event) {
        return (
          <tr key={event.id}>
            <td>{event.isClosed ? (<Glyphicon glyph="lock" title="Événement fermé" />) : null}</td>
            <td><Link to="edit-event" params={{id:event.id}}>{event.name}</Link></td>
            <td>{event.startDate.toLocaleString()}</td>
            <td>{event.endDate.toLocaleString()}</td>
            <td><ul>{this.renderMatchToEventLink(event)}{this.renderEventScheduleLink(event)}</ul></td>
          </tr>
        );
      }, this);
    }

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
            {rows}
          </tbody>
        </Table>
        {this.renderLegend()}
      </div>
    );
  },
  render: function() {
    return this.props.activeRouteHandler() || this.renderEventList();
  }
});
