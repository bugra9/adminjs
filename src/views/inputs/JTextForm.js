import React, { Component, PropTypes } from 'react';
import { Form } from 'semantic-ui-react';


class JTextForm extends Component {
  render() {
    const {input, value} = this.props;
    return (
      <Form.Input label={input.title} type="text" defaultValue={value} name={input.attr} />
    );
  }
}

JTextForm.propTypes = {
  input: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired
};

export default JTextForm;