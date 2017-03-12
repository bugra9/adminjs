import React, { Component, PropTypes } from 'react';
import { Form } from 'semantic-ui-react';
import slug from 'slug';


class JSlugForm extends Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value };
  }

  render() {
    const input = this.props.input;

    let placeholder = "";
    if(input.input.emptyValue)
      placeholder = "Boş bırakıldığında otomatik doldurulacaktır.";

    return (
      <Form.Input
        label={input.title}
        type="text"
        onChange={(e, {value}) => this.setState({ value: slug(value, {lower: true}) })}
        value={this.state.value}
        name={input.attr}
        placeholder={placeholder} />
    );
  }
}

JSlugForm.propTypes = {
  input: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired
};

export default JSlugForm;