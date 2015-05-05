import React, { PropTypes } from "react";
import { Modal, Input, Button} from "react-bootstrap";

import Application from "./Application";
import request from "../middlewares/request";

const ApplicationModal = React.createClass({
  displayName: "ApplicationModal",

  propTypes: {
    event: PropTypes.object,
    application: PropTypes.object,
    readOnly: PropTypes.bool,
  },

  contextTypes: {
    flux: PropTypes.object,
  },

  handleSubmit(e) {
    this.props.onRequestHide();
    e.preventDefault();
    const formData = {
      application: this.refs.form.getFormData(),
    };
    const url = "/application/" + this.props.application.id;
    request.put(url, formData, (err, res) => {
      this.context.flux.getActions("application").fetchUserApplications();
    });
  },

  render() {
    const { event, application, readOnly, onFormSubmit, ...props } = this.props;
    const action = event.isClosed || event.isClosedToPublic ?
      "Visualiser" :
      "Modifier";
    const bsStyle = event.isClosed || event.isClosedToPublic ?
      "info" :
      "primary";
    const title = `${action} la postulation pour ${event.name}`;
    return (
      <Modal {...props} title={title} animation={true} bsStyle={bsStyle}>
        <div className="modal-body">
          <Application ref="form" {...event} {...application}
            readOnly={readOnly} onSubmit={this.handleSubmit} />
        </div>
      </Modal>
    );
  }
});

export default ApplicationModal;
