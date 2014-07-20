/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Table = require("react-bootstrap/Table");


module.exports = React.createClass({
  displayName: "PointsLog",
  propTypes: {
    log: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        date: PropTypes.string,
        points: PropTypes.number.isRequired
      })
    ).isRequired
  },
  getInitialState: function () {
    return {};
  },
  render: function () {
    var totalPoints = 0;
    var rows = [];
    if(this.props.log.length === 0) {
      rows.push(<tr><td colSpan="2">Aucun points acquis</td></tr>);
    } else {
      rows = this.props.log.map(function (entry, index) {
        totalPoints += entry.points;
        return (
          <tr key={entry.id}>
            <td>{entry.name} {entry.date ? "(" + entry.date + ")" : null}</td>
            <td>{entry.points}</td>
          </tr>
        );
        }.bind(this));
    };

    return (
      <div className="user-points-log">
        <h3>Points accumulés <small>{totalPoints} points</small></h3>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Événement</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </Table>
      </div>
    );
  }
});
