import request from "superagent";

const BASE_URL = process.env.API_URL;

class Api {
  create(resource) {
    let data = {
      [this.constructor.resourceName.singular]: resource
    };
    const URL = this._getResourceUrl();
    return this._doPost(URL, data).then(res => this._singleResourceResponse(res));
  }

  read(id) {
    const URL = this._getResourceUrl(id);
    return this._doGet(URL).then(res => this._singleResourceResponse(res));
  }

  readAll() {
    const URL = this._getResourceUrl();
    return this._doGet(URL).then(res => this._multiResourceResponse(res));
  }

  update({ id, ...resource }) {
    let data = {
      [this.constructor.resourceName.singular]: resource
    };
    const URL = this._getResourceUrl(id);
    return this._doPut(URL, data).then(res => this._singleResourceResponse(res));
  }

  _getResourceUrl(id) {
    let url = `${this._getBaseUrl()}/${this.constructor.resourceUrl}`;
    return id ? `${url}/${id}` : url;
  }

  _getBaseUrl() {
    return BASE_URL;
  }

  _singleResourceResponse(res) {
    let resName = this.constructor.resourceName.singular;
    let Resource = this.constructor.Resource;

    if (!(res.body && res.body[resName])) {
      let err = new Error("Unexpected Error");
      err.res = res;
      return Promise.reject(err);
    }
    return Promise.resolve(new Resource(res.body[resName]));
  }

  _multiResourceResponse(res) {
    let resName = this.constructor.resourceName.plural;
    let Resource = this.constructor.Resource;
    if (!(res.body && res.body[resName])) {
      let err = new Error("Unexpected Error");
      err.res = res;
      return Promise.reject(err);
    }
    let resources = res.body[resName].map(u => new Resource(u));
    return Promise.resolve(resources);
  }

  _doGet(url) {
    return new Promise((resolve, reject) => {
      request.get(url)
      .accept("json")
      .type("json")
      .end((err, res) => {
        if (err) { return reject(err); }
        return resolve(res);
      });
    });
  }

  _doPost(url, data = {}) {
    return this._doSendDataRequest(url, data);
  }

  _doPut(url, data = {}) {
    return this._doSendDataRequest(url, data, "put");
  }

  _doSendDataRequest(url, data, method = "post") {
    return new Promise((resolve, reject) => {
      request[method](url)
      .send(data)
      .accept("json")
      .type("json")
      .end((err, res) => {
        if (err) { return reject(err); }
        return resolve(res);
      });
    });
  }
};

export default Api;
