import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, Checkbox } from 'semantic-ui-react';
import SimpleMDE from 'react-simplemde-editor';
//import './simplemde.min.css';
import 'simplemde/dist/simplemde.min.css';

import AceEditor from 'react-ace';
import 'brace/mode/markdown';
import 'brace/mode/css';
import 'brace/mode/javascript';
import 'brace/mode/html';
import 'brace/mode/json';
import 'brace/mode/yaml';
import 'brace/theme/monokai';

import { updateEditor } from '../../actions/save';

class JEditor extends Component {
  constructor(props) {
    super(props);
    let ext = location.href.substr(location.href.lastIndexOf('.')+1);
    let type = "text";
    let checked = false;
    if(["markdown", "mkdown", "mkdn", "mkd", "md"].indexOf(ext) !== -1) {
      type = "markdown";
      checked = true;
    }
    else if(ext === "css")
      type = "css";
    else if(ext === "js")
      type = "javascript";
    else if(ext === "html")
      type = "html";
    else if(ext === "json")
      type = "json";
    else if(ext === "yaml")
      type = "yaml";

    this.state = {
      checked,
      type
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.isLoading !== this.props.isLoading || nextState.checked !== this.state.checked;
  }
  /*componentWillMount() {
    console.log("Editor - componentWillMount");
    this.setState({ value: this.props.value });
  }*/

  render() {
    if(this.props.isLoading)
      return (<div>Yükleniyor...</div>);

    let editor;
    if(this.state.checked)
      editor = <SimpleMDE onChange={(value) => this.props.updateEditor(value)} value={this.props.editor} />;
    else
      editor = (<AceEditor
        defaultValue={this.props.editor}
        mode={this.state.type}
        onChange={(value) => this.props.updateEditor(value)}
        theme="monokai"
        width="100%"
        wrapEnabled={true}
        fontSize={14}
        scrollMargin={[15, 15, 15, 15]}
        ref="ace"
      />);
    return (
      <Form.Field>
        <div className="right mb5">
          <Checkbox name="markdown" label="Markdown" onChange={(e, v) => this.setState({ checked: v.checked })} defaultChecked={this.state.checked} toggle />
        </div>
        {editor}
      </Form.Field>
    );
  }
}

JEditor.propTypes = {
  input: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  editor: PropTypes.string,
  updateEditor: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  editor: state.save.editor,
  isLoading: state.save.isLoading
});

const mapDispatchToProps = (dispatch) => {
    return {
        updateEditor: (v) => dispatch(updateEditor(v))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(JEditor);