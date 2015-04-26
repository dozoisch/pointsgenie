import Flux from "../../shared/Flux";
import actionsFactory from "../actions";
import performRouteHandlerStaticMethod from "../../shared/performRouteHandlerStaticMethod";
import FluxComponent from "flummox/component";
import Router from "react-router/build/npm/lib";
import routes from "../../shared/routes";
import ServerStore from "../../shared/stores/ServerStore";

import React from "react";
import stats from "../../build/stats.json";

var publicPath = stats.publicPath;

var STYLE_URL;
var SCRIPT_URL_COMMON;
var SCRIPT_URL_APP = publicPath + [].concat(stats.assetsByChunkName.app)[0]
var SCRIPT_URL_ADMIN = publicPath + [].concat(stats.assetsByChunkName.admin)[0];
if (process.env.NODE_ENV === "production") {
  var COMMON_CHUNK = stats.assetsByChunkName.commons;
  STYLE_URL = (publicPath + COMMON_CHUNK[1] +"?" + stats.hash);
  SCRIPT_URL_COMMON =  publicPath + COMMON_CHUNK[0] + "?" + stats.hash;
  SCRIPT_URL_APP += "?" + stats.hash;
  SCRIPT_URL_ADMIN += "?" + stats.hash;
}

exports.index = function *() {
  const currentUser = this.passport.user ? this.passport.user.toJSON() : null;
  const actions = actionsFactory({ koaContext: this });
  const flux = new Flux(actions, currentUser);
  if (process.env.NODE_ENV === "development") {
    flux.on("dispatch", (dispatch) => {
      const { actionId, ...payload } = dispatch;
      console.log("Flux dispatch:", dispatch.actionId, payload);
    });
  }

  const serverStore = flux.createStore("server", ServerStore, flux);

  const router = Router.create({
    routes: routes,
    location: this.url,
    transitionContext: { flux },
    onError: error => {
      throw error;
    },
    onAbort: abortReason => {
      console.log("ERROR");
      const error = new Error();
      if (abortReason.constructor.name === "Redirect") {
        const { to, params, rawQuery } = abortReason;
        const redirectUrl = /signout|logout/.test(this.url) ? undefined : this.url;
        const query = { ...rawQuery, redirect: redirectUrl };
        const url = router.makePath(to, params, query);
        error.redirect = url;
      }
      throw error;
    }
  });

  let appString;
  try {
    const { Handler, state } = yield new Promise((resolve, reject) => {
      router.run((_Handler, _state) =>
        resolve({ Handler: _Handler, state: _state })
      );
    });
    yield new Promise((resolve, reject) => {
      serverStore.on("change", () => {
        if (serverStore.isLoaded()) {
          return resolve();
        }
      });
      React.renderToString(
        <FluxComponent flux={flux}>
          <Handler/>
        </FluxComponent>
      );
      if (serverStore.isLoaded()) {
        return resolve();
      }
    });

    appString = React.renderToString(
      <FluxComponent flux={flux}>
        <Handler/>
      </FluxComponent>
    );

  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("Error rendering:", error);
    }
    console.log("redirect?", error.redirect);
    if (error.redirect) {
      return this.redirect(error.redirect);
    }

    throw error;
  }

  const DATA = flux.dehydrate();
  console.log(DATA, this.passport.user);
  this.body = yield this.render("index", {
    isAuth: !!this.passport.user,
    render: appString,
    DATA: JSON.stringify(DATA),
    version: stats.appVersion,
    commit: stats.appCommit,
    STYLE_URL: STYLE_URL,
    SCRIPT_URL_COMMON: SCRIPT_URL_COMMON,
    SCRIPT_URL_APP: SCRIPT_URL_APP,
  });
};

exports.admin = function *() {
  this.body = yield this.render("admin", {
    user: this.passport.user,
    version: stats.appVersion,
    commit: stats.appCommit,
    STYLE_URL: STYLE_URL,
    SCRIPT_URL_COMMON: SCRIPT_URL_COMMON,
    SCRIPT_URL_ADMIN: SCRIPT_URL_ADMIN,
  });
};
