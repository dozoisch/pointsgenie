import React from "react";
import Router from "react-router/build/npm/lib";
import FluxComponent from "flummox/component";

import actionsFactory from "./actions";
import Flux from "../shared/Flux";
import routes from "../shared/routes";
import ServerStore from "../shared/stores/ServerStore";

export default function *(koaContext) {
  const currentUser = koaContext.passport.user ? koaContext.passport.user.toJSON() : null;
  const actions = actionsFactory({ koaContext });
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
    location: koaContext.url,
    transitionContext: { flux },
    onError: error => {
      throw error;
    },
    onAbort: abortReason => {
      const error = new Error();
      if (abortReason.constructor.name === "Redirect") {
        const { to, params, rawQuery } = abortReason;
        const redirectUrl = /signout|logout|^\/$/.test(koaContext.url) ? undefined : koaContext.url;
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
    throw error;
  }

  const DATA = flux.dehydrate();

  return {
    DATA,
    appString,
  };
};
