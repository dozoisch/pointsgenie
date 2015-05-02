import React from "react";
import Router from "react-router/build/npm/lib";

import "./less/main.less";

import routes from "../shared/adminRoutes";

import FluxComponent from "flummox/component";
import Flux from "../shared/Flux";
import actions from "./actions";

const flux = new Flux(actions);

if (process.env.NODE_ENV !== "production") {
  flux.on("dispatch", (dispatch) => {
    const { actionId, ...payload } = dispatch;
    console.log("Dispatch:", actionId, payload);
  });
}

if (typeof window !== undefined && window.DATA) {
  flux.hydrate(window.DATA);
}

const router = Router.create({
  routes,
  // location: Router.HistoryLocation,
  transitionContext: { flux },
});

router.run(async (Handler, state) => {
  React.render(
    <FluxComponent flux={flux}>
      <Handler />
    </FluxComponent>,
    document.getElementById("page-container")
  );
});

