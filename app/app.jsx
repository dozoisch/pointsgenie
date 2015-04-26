import React from "react";
import Router, { Route, DefaultRoute } from "react-router/build/npm/lib";

import "./less/main.less";

import routes from "../shared/routes";

import FluxComponent from "flummox/component";
import Flux from "../shared/Flux";
import actions from "./actions";
import performRouteHandlerStaticMethod from "../shared/performRouteHandlerStaticMethod";

const flux = new Flux(actions);

if (process.env.NODE_ENV !== "production") {
  flux.on("dispatch", (dispatch) => {
    const { actionId, ...payload } = dispatch;
    console.log("Dispatch:", actionId, payload);
  });
}

if (typeof window !== undefined && window.DATA) {
  flux.deserialize(window.DATA);
}

const router = Router.create({
  routes,
  location: Router.HistoryLocation,
  transitionContext: { flux },
});

router.run(async (Handler, state) => {
  const routeHandlerInfo = { state, flux };

  React.render(
    <FluxComponent flux={flux}>
      <Handler />
    </FluxComponent>,
    document.getElementById("page-container")
  );
});
