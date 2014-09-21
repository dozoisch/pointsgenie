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
      return (<Link to="match-to-event" params={{id:event.id}}>Attribuer les postes</Link>);
    }
  },
  renderEventList: function () {
    var rows = [];
    if(this.state.events.length === 0) {
      rows.push(<tr key="emptyTable"><td colSpan="4">Aucun événement</td></tr>);
    } else {
      rows = this.state.events.map(function (event) {
        return (
          <tr key={event.id}>
            <td>{event.isClosed ? (<Glyphicon glyph="lock" title="Événement fermé" />) : null}</td>
            <td><Link to="edit-event" params={{id:event.id}}>{event.name}</Link></td>
            <td>{event.startDate.toLocaleString()}</td>
            <td>{event.endDate.toLocaleString()}</td>
            <td>{this.renderMatchToEventLink(event)}{/* Actions delete */}</td>
          </tr>
        );
      }, this);
    }

    return (
      <div className="event-list">
        <h3>Événements</h3>
        <Table bordered hover responsive>
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
