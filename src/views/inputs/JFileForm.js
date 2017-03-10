import React, { Component, PropTypes } from 'react';
import { Form, Card, Icon, Sidebar, Menu, Button, Segment } from 'semantic-ui-react';

import JFile from '../compenents/file';

class JFileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {visible: false, value: props.value};
  }

  render() {
    let { visible, value } = this.state;
    const input = this.props.input;

    return (
      <div>
        <Form.Input label={input.title} type="text" value={value} name={input.attr} action={<Button onClick={() => this.setState({ visible: !this.state.visible })} type="button">Seç</Button>} />
        <JFile path={input.input.path} visible={this.state.visible} value={value?value:""} onChange={(v) => this.setState({ value: v, visible: !this.state.visible })}  />
      </div>
    );
  }
}

JFileForm.propTypes = {
  value: PropTypes.string.isRequired
};

export default JFileForm;