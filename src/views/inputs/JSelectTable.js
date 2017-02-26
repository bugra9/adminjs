import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {Label } from 'semantic-ui-react';

class JSelectTable extends Component {


  render() {
    const {input, value} = this.props;
    let out = [];

    if(input.input.isRelated && value !== "") {
      let options = [];
      let temp3 = this.props.tree;
      for(let val of input.input.path.split('/'))
        temp3 = temp3[val];
      for(let val of Object.values(temp3))
        if(Array.isArray(value) && value.indexOf(val.content[input.input.value]) !== -1)
          options.push(val.content.title);
        else if(value === val.content[input.input.value])
          options.push(val.content.title);

      if(options.length === 1)
        out.push(options[0]);
      else {
        for(let val of options)
          out.push(<Label key={val}>{val}</Label>);
        out = <Label.Group>{out}</Label.Group>;
      }
    }
    else
      out = value;

    return (
      <td>{out}</td>
    );
  }
}

JSelectTable.propTypes = {
  input: PropTypes.object.isRequired,
  tree: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  tree: state.tree.tree
});

export default connect(mapStateToProps)(JSelectTable);