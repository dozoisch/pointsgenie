import request from "superagent";
import ResourceApi from "./resource-api";
import User from "../models/user";

class UserApi extends ResourceApi {

  changePassword(data) {
    const URL = `${this._getResourceUrl("me")}/password`;
    return this._doPost(URL, data).then(res => this._singleResourceResponse(res));
  }

  makeAdmin(id) {
    const URL = `${this._getResourceUrl(id)}/makeadmin`;
    return this._doPost(URL).then(res => this._singleResourceResponse(res));
  }

  fetchProfile(id) {
    const URL = `${this._getResourceUrl(id)}/fetchprofile`;
    return this._doPost(URL).then(res => this._singleResourceResponse(res));
  }

  assignPromocard(cip) {
    const URL = `/promocard/${cip}`;
    return this._doPost(URL).then(res => this._singleResourceResponse(res));
  }

  awardPoints({ id, ...data }) {
    const URL = `${this._getResourceUrl(id)}/awardpoints`;
    return this._doPost(URL, data).then(res => this._singleResourceResponse(res));
  }

  batchAwardPoints(data) {
    const URL = `${this._getResourceUrl()}/awardpoints`;
    return this._doPost(URL, data).then(res => this._multiResourceResponse(res));
  }
};

UserApi.resourceUrl = "users";
UserApi.resourceName = {
  singular: "user",
  plural: "users",
};
UserApi.Resource = User;

export default UserApi;
