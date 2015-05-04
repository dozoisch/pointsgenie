import ResourceApi from "./ResourceApi";
import Application from "../models/Application";

class ApplicationApi extends ResourceApi {
  static resourceUrl = "applications";
  static resourceName = {
    singular: "application",
    plural: "applications",
  };
  static Resource = Application;

  readForCurrentUser() {
    const URL = `${this.BASE_URL}/users/me/applications`;
    return this._doGet(URL);
  }
};

export default ApplicationApi;
