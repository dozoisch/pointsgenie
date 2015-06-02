"use strict";
import React, { PropTypes } from "react";
import { Input, Row, Col, Button, TabbedArea, TabPane } from "react-bootstrap";

import dateHelper from "../../middlewares/date";

import Form from "./form";
import Printable from "./printable";

const MatchToEventWrapper = React.createClass({
  displayName: "MatchToEventWrapper",

  propTypes: {
    onSubmit: PropTypes.func.isRequired,
    event: PropTypes.shape({
      name: PropTypes.string,
      startDate: PropTypes.instanceOf(Date),
      endDate: PropTypes.instanceOf(Date),
      tasks: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    applications: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      user: PropTypes.string.isRequired,
      preferredTask: PropTypes.string,
      availabilities: PropTypes.arrayOf(
        PropTypes.instanceOf(Date)
      ).isRequired,
    })).isRequired,
    users: PropTypes.objectOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        totalPoints : PropTypes.number.isRequired,
      })
    ).isRequired,
    isSubmitting: PropTypes.bool,
  },

  getInitialState() {
    return {
      applications: this.getMappedApplications(this.props.applications),
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.applications) {
      this.setState({ applications: this.getMappedApplications(nextProps.applications) });
    }
  },

  getFormData() {
    return this.refs.form.getFormData();
  },

  getMappedApplications(applications) {
    let mappedApplications = {};
    // @FIX find better algo...
    for (let application of applications) {
      let userTask = {};
      const user = this.props.users[application.user];

      // Skip it if the user is not found... should not happen
      if (!user) {
        continue;
      }
      let userPoints = user.totalPoints || 0;
      // push in the map
      for (let hour of application.availabilities) {
        mappedApplications[hour] = mappedApplications[hour] || {};
        for (let task of this.props.event.tasks) {
          mappedApplications[hour][task] = mappedApplications[hour][task] || [];

          // Default is this is not the users preferred task
          let modifier = 100.01;
          let preferenceClassName = "not-preferred";
          if (!application.preferredTask) {
            // The user has no preferred task at all
            modifier = 100;
            preferenceClassName = "no-preference";
          } else if (application.preferredTask === task) {
            // This is the user preferred task
            modifier = 99.99;
            preferenceClassName = "preferred"
          }
          mappedApplications[hour][task].push({
            id: application.user,
            // Reduce the rank if it's users preferred task
            // Add one point to make sure that even 0 points users are ranked.
            rank: (userPoints + 1 ) * modifier,
            preferenceClassName: preferenceClassName,
          });
        };
      };
    };

    return mappedApplications;
  },

  getUsersFromMappedApplication(hour, task) {
    const applications = this.state.applications[hour];
    if (!applications) { return [] };

    let users = applications[task];
    if (!users) { return []; }

    // sort ascending
    users.sort(function (a, b) {
      return (a.rank - b.rank);
    });

    // retrieve real user array
    return users.map((user) => {
      let modifiedUser = this.props.users[user.id];
      modifiedUser.preferenceClassName = user.preferenceClassName;
      return modifiedUser;
    });
  },

  render() {
    return (
      <TabbedArea defaultActiveKey={1}>
        <TabPane eventKey={1} tab="Formulaire">
          <Form ref="form" event={this.props.event}
            getHourTaskUserList={this.getUsersFromMappedApplication}
            isSubmitting={this.props.isSubmitting} onSubmit={this.props.onSubmit} />
        </TabPane>
        <TabPane eventKey={2} tab="Imprimable">
          <Printable ref="printable" event={this.props.event}
            getHourTaskUserList={this.getUsersFromMappedApplication} />
        </TabPane>
      </TabbedArea>
    );
  },
});

export default MatchToEventWrapper;
