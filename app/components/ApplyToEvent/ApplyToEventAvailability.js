import React, { PropTypes } from "react";
import { Row, Col, Input } from "react-bootstrap";

import dateHelper from "../../middlewares/date";

const ApplyToEventAvailability = React.createClass({
  displayName: "ApplyToEventAvailability",

  propTypes: {
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    onChange: PropTypes.func.isRequired,
  },

  getFormData() {
    let data = [];
    const refs = this.refs;
    for (let key of Object.keys(refs)) {
      if(refs[key].getChecked()) {
        data.push(new Date(parseInt(key, 10)));
      }
    };
    return data;
  },

  isValid() {
    var refs = this.refs;

    for (var key in refs) {
      if(refs[key].getChecked()) {
        return true;
      }
    }
    return false;
  },

  createCheckboxes() {
    var currDate = dateHelper.clone(this.props.startDate);
    var checkboxes = {};
    while(currDate.getTime() < this.props.endDate.getTime()) {
      var key = currDate.getTime();
      checkboxes[currDate.getDate()] = checkboxes[currDate.getDate()] || [];
      checkboxes[currDate.getDate()].push(
        <Col md={1} xs={2} key={key}>
          <Input type="checkbox" ref={key}
            label={currDate.getHours() + "h"}
            onChange={this.props.onChange}
          />
        </Col>
      );
      currDate = dateHelper.addHours(currDate, 1);
    }
    return checkboxes;
  },
  renderCheckboxes() {
    var checkboxes = this.createCheckboxes();
    var rows = [];
    for (let key of Object.keys(checkboxes)) {
      rows.push(
        <div key={key}>
          <div> Le {key}</div>
          <Row>
            {checkboxes[key]}
          </Row>
        </div>
      );
    };
    return {rows};
  },

  render() {
    var valid = this.isValid();
    return (
      <Input bsStyle={ valid ? null : "error" } wrapperClassName="wrapper"
        help={valid ? null :  "Au moins une heure de disponibilité doit être sélectionnée!"}
      >
        {this.renderCheckboxes()}
      </Input>
    );

  }
});

export default ApplyToEventAvailability;
