import React, { Component, PropTypes } from 'react';

import JTextForm from './JTextForm';
import JTextTable from './JTextTable';
import JDateTimeForm from './JDateTimeForm';
import JDateTimeTable from './JDateTimeTable';
import JSelectForm from './JSelectForm';
import JSelectTable from './JSelectTable';
import JEditor from './JEditor';
import JFileForm from './JFileForm';
import JSlugForm from './JSlugForm';

class JInput extends Component {

  render() {
    const {input, type} = this.props;
    let value = this.props.value;
    if(!value)
      value = "";

    switch(input.input.type) {
      case "text":
        if(type === "Input")
          return (
            <JTextForm input={input} value={String(value)} />
          );
        else
          return (
            <JTextTable input={input} value={String(value)} />
          );
      case "number":
        if(type === "Input")
          return (
            <JTextForm type="number" input={input} value={value} />
          );
        else
          return (
            <JTextTable input={input} value={String(value)} />
          );
      case "slug":
        if(type === "Input")
          return (
            <JSlugForm input={input} value={String(value)} />
          );
        else
          return (
            <JTextTable input={input} value={String(value)} />
          );
      case "editor":
        if(type === "Input")
          return (
            <JEditor input={input} value={value} />
          );
        else
          return (
            <JTextTable input={input} value={String(value)} />
          );
      case "file":
        if(type === "Input")
          return (
            <JFileForm input={input} value={value} />
          );
        else
          return (
            <JTextTable input={input} value={String(value)} />
          );
      case "date":
        if(type === "Input")
          return (
            <JDateTimeForm input={input} value={value} />
          );
        else
          return (
            <JDateTimeTable input={input} value={value} />
          );
      case "select":
        if(type === "Input")
          return (
            <JSelectForm input={input} value={value} />
          );
        else
          return (
            <JSelectTable input={input} value={value} />
          );
      default:
        if(type === "Input")
          return (
            <JTextForm input={input} value={String(value)} />
          );
        else
          return (
            <JTextTable input={input} value={String(value)} />
          );
    }
  }
}

JInput.propTypes = {
  input: PropTypes.object.isRequired,
  type: PropTypes.string
};

export default JInput;