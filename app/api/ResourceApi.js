import Api from "./Api";

class ResourceApi extends Api {
    static resourceUrl;
    static resourceName = {
      singular: null,
      plural: undefined,
    };
    static Resource;


  create(resource) {
    const data = {
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
    const data = {
      [this.constructor.resourceName.singular]: resource
    };
    const URL = this._getResourceUrl(id);
    return this._doPut(URL, data).then(res => this._singleResourceResponse(res));
  }

  _getResourceUrl(id) {
    let url = `${this.BASE_URL}/${this.constructor.resourceUrl}`;
    return id ? `${url}/${id}` : url;
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
};

export default ResourceApi;
