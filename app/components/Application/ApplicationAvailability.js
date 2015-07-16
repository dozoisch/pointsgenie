import React, { PropTypes } from "react";
import { Row, Col, Input } from "react-bootstrap";

import dateHelper from "../../middlewares/date";

const ApplicationAvailability = React.createClass({
  displayName: "ApplicationAvailability",

  propTypes: {
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    obligatoryHours: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    valid: PropTypes.bool,
    readOnly: PropTypes.bool,
  },

  componentDidMount() {
    setImmediate(this.props.onChange);
  },

  getFormData() {
    let data = [];
    const refs = this.refs;
    for (let key of Object.keys(refs)) {
      if (refs[key].getChecked()) {
        data.push(key);
      }
    };
    return data;
  },

  getMinObligatoryHour() {
    return dateHelper.addHours(dateHelper.clone(this.props.endDate), -1 * this.props.obligatoryHours);
  },

  createCheckboxes() {
    let currDate = dateHelper.clone(this.props.startDate);
    let checkboxes = {};
    const minObligatoryHour = this.getMinObligatoryHour();

    while(currDate.getTime() < this.props.endDate.getTime()) {
      const key = currDate.toISOString();
      const checked = this.props.values && this.props.values.indexOf(key) !== -1;
      checkboxes[currDate.getDate()] = checkboxes[currDate.getDate()] || [];
      checkboxes[currDate.getDate()].push(
        <Col md={1} xs={2} key={key}>
          <Input type="checkbox" ref={key}
            disabled={this.props.readOnly || currDate.getTime() >= minObligatoryHour.getTime()}
            label={currDate.getHours() + "h"}
            checked={checked || currDate.getTime() >= minObligatoryHour.getTime()}
            title={currDate.getTime() >= minObligatoryHour.getTime() ? 'Heure obligatoire' : ''}
            onChange={this.props.onChange}
          />
        </Col>
      );
      currDate = dateHelper.addHours(currDate, 1);
    }
    return checkboxes;
  },

  renderCheckboxes() {
    const checkboxes = this.createCheckboxes();
    let rows = [];
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
    const { valid } = this.props;
    return (
      <Input bsStyle={ valid ? null : "error" } wrapperClassName="wrapper"
        help={valid ? null :  "Au moins une heure de disponibilité doit être sélectionnée!"}
      >
        {this.renderCheckboxes()}
      </Input>
    );

  }
});

export default ApplicationAvailability;
