/** @jsx React.DOM */
"use strict";
var React = require("react");
var PropTypes = React.PropTypes;

module.exports = React.createClass({
  displayName: "MatchToEventForm",
  propTypes: {
    event: PropTypes.shape({
      name: PropTypes.string,
      startDate: PropTypes.instanceOf(Date),
      endDate: PropTypes.instanceOf(Date),
      tasks: PropTypes.arrayOf(PropTypes.string),
      wildcardTask: PropTypes.string,
    }).isRequired,
    applications: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        user: PropTypes.string.isRequired,
        tasks: PropTypes.arrayOf(PropTypes.shape({
          first: PropTypes.string,
          second: PropTypes.string,
          third: PropTypes.string,
        })).isRequired,
        availabilities: PropTypes.arrayOf(
          PropTypes.instanceOf(Date)
        ).isRequired,
    })).isRequired
  },
  componentWillMount: function () {
    EventStore.init();
  },
  componentDidMount: function () {
    EventStore.addChangeListener(this.updateEvent);
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
  render: function () {
    return (
      <form>

      </form>
    );
  }
})
