import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';

class JSelectForm extends Component {
  render() {
    const {input} = this.props;
    let {value} = this.props;

    let multiple = false;
    if(input.input.multiple) {
      multiple = true;
      if(!Array.isArray(value))
        value = [];
    }

    let options = [];
    if(!input.input.isRelated) {
      for(let i in input.input.options) if(input.input.options.hasOwnProperty(i))
        options.push({ key: i, text: input.input.options[i], value: i });
    }
    else {
      let temp3 = this.props.tree;
      //console.log("this.props.tree", this.props.tree);
      for(let val of input.input.path.split('/'))
        temp3 = temp3[val];

      for(let val of Object.values(temp3)) {
        if(!val.content)
          continue;
        options.push({ key: val.content[input.input.value], text: val.content.title, value: val.content[input.input.value] });
      }
    }

    return (
      <Form.Select label={input.title} name={input.attr} defaultValue={value} options={options} placeholder={input.title} multiple={multiple} selection search />
    );
  }
}

JSelectForm.propTypes = {
  input: PropTypes.object.isRequired,
  tree: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  tree: state.tree.tree
});

export default connect(mapStateToProps)(JSelectForm);