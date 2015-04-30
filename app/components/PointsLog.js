import React, { PropTypes } from "react";
import { Table } from "react-bootstrap";

const PointsLog = React.createClass({
  displayName: "PointsLog",

  propTypes: {
    log: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        reason: PropTypes.string.isRequired,
        points: PropTypes.number.isRequired,
      })
    ),
  },

  getInitialState() {
    return {};
  },

  render() {
    let rows = [];
    let totalPoints = 0;
    if(!this.props.log || this.props.log.length === 0) {
      rows.push(<tr key="emptyTable"><td colSpan="2">Aucun point acquis</td></tr>);
    } else {
      rows = this.props.log.map((entry, index) => {
        let points = parseFloat(entry.points, 10);
        totalPoints += points;
        return (
          <tr key={entry.id} className={points < 0 ? "negative" : undefined}>
            <td>{entry.reason}</td>
            <td>{entry.points}</td>
          </tr>
        );
      });
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

export default PointsLog;
