import React, { Component, PropTypes } from 'react';
import Datetime from 'react-datetime';
import 'moment/locale/tr';
import 'react-datetime/css/react-datetime.css';


class JDateTimeForm extends Component {
  render() {
    let {input, value} = this.props;
    if(!value)
      value = new Date();

    return (
      <div className="field">
        <label>{input.title}</label>
        <Datetime inputProps={{name: input.attr}} defaultValue={value} locale="tr" dateFormat="YYYY-MM-DD" timeFormat="HH:mm" />
      </div>
    );
  }
}

JDateTimeForm.propTypes = {
  input: PropTypes.object.isRequired
};

export default JDateTimeForm;