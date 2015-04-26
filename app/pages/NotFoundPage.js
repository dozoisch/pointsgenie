import React, { PropTypes, Component } from "react";

class NotFoundPage extends Component {
  static displayName = "NotFoundPage";

  static contextTypes = {
    router: PropTypes.func,
  }

  render() {
    return (
      <div>
        <h1>404 <small>| Page non trouvée</small></h1>
        <p>Desolé, le chemin suivant:</p>
        <pre>{this.context.router.getCurrentPath()}</pre>
        <p>n'existe pas sur ce site.</p>
        <p>Êtes-vous sûr d'avoir le bon chemin?</p>
      </div>
    );
  }
};

export default NotFoundPage;
