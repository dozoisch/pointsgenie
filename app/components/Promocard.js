import React, { PropTypes } from "react";
import { Input } from "react-bootstrap";

const Promocard = React.createClass({
  displayName: "Promocard",

  propTypes: {
    promocard: PropTypes.shape({
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      date: PropTypes.instanceOf(Date)
    }),
  },

  renderInner: function () {
    if (this.props.promocard && this.props.promocard.date) {
      return (
        <form className="form-horizontal">
          <Input type="static" label="Prix payé" labelClassName="col-md-3"
            wrapperClassName="col-md-6" value={this.props.promocard.price + "$"} />
          <Input type="static" label="Date" labelClassName="col-md-3"
            wrapperClassName="col-md-6" value={this.props.promocard.date.toLocaleDateString()} />
        </form>
      );
    }
    return (<p> La promocarte n'a pas été achetée encore.</p>);
  },
  render: function() {
    return (
      <div className="user-promocard-info">
        <h4>Promocarte</h4>
        {this.renderInner()}
      </div>
    );
  },
});

export default Promocard;
