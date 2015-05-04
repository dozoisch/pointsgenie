import React, { PropTypes } from "react";
import TransitionGroup from "react/lib/ReactCSSTransitionGroup";

import { RouteHandler, Link } from "react-router/build/npm/lib";

import makeFullHeight from "../composition/makeFullHeight";

const AdminApplication = React.createClass({
  displayName: "AdminApplication",

  contextTypes: {
    router: PropTypes.func
  },

  getInitialState() {
    return {
      height: 0,
    };
  },

  render() {
    const name = this.context.router.getCurrentPath();
    return (
      <div className="row" >
        <nav className="col-md-2" role="navigation">
          <h3>Administration</h3>
          <ul className="nav nav-pills nav-stacked">
            <li><Link to="list-events">Événements</Link></li>
            <li><Link to="create-event">Créer un événement</Link></li>
            <li><Link to="promocard">Attribuer une promocarte</Link></li>
            <li><Link to="list-users">Usagers</Link></li>
          </ul>
        </nav>
        <div className="transition-crop col-md-10" style={{ "minHeight": this.props.height }}>
          <TransitionGroup transitionName="transition">
            <div className="well printable-content" key={name}>
              <RouteHandler />
            </div>
          </TransitionGroup>
        </div>
      </div>
    );
  }
});


const FullHeightAdminApplication = makeFullHeight(AdminApplication, () => {
  let height = window.innerHeight;
  let navbarHeight = document.getElementsByClassName("content-wrapper")[0].getBoundingClientRect().top;
  let footerHeight = document.getElementsByClassName("footer")[0].offsetHeight;
  return height - navbarHeight - footerHeight;
});

export default FullHeightAdminApplication;
