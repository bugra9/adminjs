import React, { Component, PropTypes } from 'react';
import { Form } from 'semantic-ui-react';


class JTextForm extends Component {
  render() {
    const {input, value} = this.props;
    let type = this.props.type;
    if(!type)
      type = "text";
    return (
      <Form.Input label={input.title} type={type} defaultValue={value} name={input.attr} />
    );
  }
}

JTextForm.propTypes = {
  input: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired
};

export default JTextForm;