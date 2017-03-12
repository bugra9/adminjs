import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';

class JSelectForm extends Component {
  constructor(props) {
    super(props);

    let value = props.value;
    if(props.input.input.multiple && !Array.isArray(value))
      value = [];

    let options = [];
    if(!props.input.input.isRelated) {
      for(let i in props.input.input.options) if(props.input.input.options.hasOwnProperty(i))
        options.push({ key: i, text: props.input.input.options[i], value: i });
    }
    else {
      let temp3 = props.tree;
      //console.log("this.props.tree", this.props.tree);
      for(let val of props.input.input.path.split('/'))
        temp3 = temp3[val];

      for(let val of Object.values(temp3)) {
        if(!val.content)
          continue;
        options.push({ key: val.content[props.input.input.value], text: val.content.title, value: val.content[props.input.input.value] });
      }
    }

    let defaultOptions = [];
    for(let val of options)
      defaultOptions.push(val.value);

    this.state = {value, options, defaultOptions};
  }

  handleChange = (e, { value }) => {
    this.setState({ value: value });

    if(!this.props.input.input.allowAdditions)
      return;

    let temp = [];
    if(Array.isArray(value)) {
      for(let v of value)
        if(this.state.defaultOptions.indexOf(v) === -1)
          temp.push(v);
    }
    else if(this.state.defaultOptions.indexOf(value) === -1)
          temp.push(value);

    if(this.props.input.input.isRelated)
      this.props.addDoc({ [this.props.input.input.path]: {attr: this.props.input.input.value, data: temp} });
  }
  handleAddition = (e, { value }) => {
    this.setState({
      options: [{ text: value, value }, ...this.state.options]
    });
  }

  render() {
    const {input} = this.props;
    let {value} = this.props;

    let multiple = false;
    if(input.input.multiple)
      multiple = true;

    return (
      <Form.Select
        allowAdditions={input.input.allowAdditions?true:false}
        onAddItem={this.handleAddition}
        onChange={this.handleChange}
        label={input.title}
        name={input.attr}
        value={this.state.value}
        options={this.state.options}
        placeholder={input.title}
        multiple={multiple}
        noResultsMessage="Sonuç bulunamadı."
        additionLabel="Ekle: "
        selection search />
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

const mapDispatchToProps = (dispatch) => {
    return {
        addDoc: (doc) => dispatch({ type: 'ADD_DOCUMENT', doc })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(JSelectForm);