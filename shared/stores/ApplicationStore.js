import BaseStore from "./BaseStore";
import Application from "../../app/models/Application";


class ApplicationStore extends BaseStore {
  static serialize = function(state) {
    return JSON.stringify(state);
  };

  static deserialize = function(state) {
    if (state) {
      let parsed = JSON.parse(state);
      if (!parsed.applications) {
        parsed.applications = {};
      }
      for (let key in parsed.applications) {
        const event = parsed.applications[key];
        parsed.applications[key] = new Application(event);
      }
      return parsed;
    }
    return null;
  };

  constructor(flux) {
    super();
    const applicationActions = flux.getActions("application");
    this.registerAsync(applicationActions.fetchUserApplications,
      this.handleBeginFetchUserApplications,
      this.handleUserApplications,
      this.handleFailedFetchUserApplications
    );

    this.state = {
      applications: {},
    };
    this.flux = flux;
  }

  getError() {
    return this.state.error;
  }

  getUserApplicationEventIds() {
    if (this.state.fetchedUserApplications) {
      return this.state.userApplicationIds.map(
        id => this.state.applications[id].event
      );
    }
    return [];
  }

  getUserApplications() {
    if (this.state.fetchedUserApplications) {
      return this.state.userApplicationIds.map(
        id => this.state.applications[id]
      );
    }
    if (!this.state.isLoading) {
      this.flux.getActions("application").fetchUserApplications();
    }
    return [];
  }

  handleBeginFetchUserApplications() {
    this.handleBeginAsyncRequest();
    this.setState({
      fetchedUserApplications: false,
    });
  }

  handleUserApplications({ applications }) {
    this.handleFinishAsyncRequest();
    let newApplications = this.state.applications;
    const userApplicationIds = applications.map((application) => {
      newApplications[application.id] = application;
      return application.id;
    });
    this.setState({
      userApplicationIds,
      fetchedUserApplications: true,
      applications: newApplications,
    });
  }

  handleFailedFetchUserApplications(err) {
    this.handleFinishAsyncRequest();
    // @TODO handle error
    this.setState({
      fetchedUserApplications: true,
    });
  }

}


export default ApplicationStore;
