"use strict";
var React = require("react");
var PropTypes = React.PropTypes;

var ApplicationWrapper = require("./application/wrapper");
var EventStore = require("../stores/event");
var request = require("../middlewares/request");

module.exports = React.createClass({
  displayName: "ApplyToEvent",
  propTypes: {
    promocard: PropTypes.shape({
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      date: PropTypes.instanceOf(Date)
    })
  },
  getInitialState: function() {
    return {
      events: [],
    };
  },
  componentDidMount: function () {
    this.loadEvents();
  },
  loadEvents: function () {
    request.get("/events/upcoming", function (err, res) {
      if (err || res.status !== 200) return;

      var sei = this.state.sei > res.body.events.length ?
        0 : this.state.sei;

      this.setState({
        events: res.body.events.map(function (event) {
          return EventStore.parseEvent(event);
        }),
        selectedEventIndex: sei,
      });
    }.bind(this));
  },
  handleFormSubmit: function (e) {
    e.preventDefault();
    if (!this.refs.wrapper.isValid()) {
      return;
    }
    this.setState({ isSubmitting: true });
    var formData = this.refs.wrapper.getFormData();
    var event = this.refs.wrapper.getSelectedEvent();
    var url = "/apply/" + event.id;
    request.post(url, formData, function (err, res) {
      var state = { isSubmitting: false };
      if (err) {
        state.alert = { style: "danger", message: "Erreur non-controlée: " + err.message };
      } else if (res.status === 200) {
        state.alert = { style: "success", message: "Postulance acceptée pour " + event.name  + "!" };
      } else {
        state.alert = { style: "danger", message: res.body.error };
      }
      this.setState(state, this.loadEvents);
    }.bind(this));
  },
  handleAlertDismiss: function () {
    this.setState({ alert: undefined });
  },
  render: function () {
    if (this.props.promocard && this.props.promocard.date) {
      return (<ApplicationWrapper ref="wrapper" eventList={this.state.events} isFormSubmitting={this.state.isFormSubmitting}
        alert={this.state.alert} onAlertDismiss={this.handleAlertDismiss}
        onFormSubmit={this.handleFormSubmit}
      />);
    } else {
      return (
        <div className="apply-event">
          <h3>Postuler pour un événement</h3>
          <div>Vous devez avoir une promocarte afin de pouvoir postuler à un événement.
          Veuillez contacter votre association étudiante</div>
        </div>
      );
    }
  }
});
