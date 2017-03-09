import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, Checkbox, Card, Icon, Sidebar, Menu, Button, Segment } from 'semantic-ui-react';
import SimpleMDE from 'react-simplemde-editor';
import 'simplemde/dist/simplemde.min.css';
import './editor/github-markdown.css';
import './editor/sendeyaz.css';

import AceEditor from 'react-ace';
import 'brace/mode/markdown';
import 'brace/mode/css';
import 'brace/mode/javascript';
import 'brace/mode/html';
import 'brace/mode/json';
import 'brace/mode/yaml';
import 'brace/theme/monokai';

import { updateEditor } from '../../actions/save';
import JFile from '../compenents/file';

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
      visible: false,
      editor: null,
      checked,
      type
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.isLoading !== this.props.isLoading || nextState.checked !== this.state.checked || nextState.visible !== this.state.visible;
  }
  /*componentWillMount() {
    console.log("Editor - componentWillMount");
    this.setState({ value: this.props.value });
  }*/

  render() {
    let simpleMDEOptions = {
      toolbar: ["bold", "italic", "heading-2", "heading-3", "heading-4",
        {
              name: "definition-list",
              action: function(editor){
                let cm = editor.codemirror;
                let startPoint = cm.getCursor("start");
                let endPoint = cm.getCursor("end");
                let text = cm.getSelection();
                cm.replaceSelection("Tanımlanacak İsim\n: Buraya tanım yazılacak.");
                cm.setSelection(startPoint, endPoint);
              },
              className: "fa fa-book",
              title: "İsim Tanımlama",
          },
        "|", "quote", "code", "unordered-list", "ordered-list", "|",
        "link",
        {
          name: "image",
          title: "Resim Ekle",
          className: "fa fa-picture-o",
          action: (editor) => this.setState({ visible: !this.state.visible, editor })
        },
        "table", "horizontal-rule", "|", "preview", "side-by-side", "fullscreen"
      ],
      lang: {
        "bold": "Kalın",
        "italic": "Eğik",
        "strikethrough": "",
        "heading-1": "Başlık 1",
        "heading-2": "Başlık 2",
        "heading-3": "Başlık 3",
        "heading-4": "Başlık 4",
        "code": "Kod",
        "quote": "Alıntı",
        "unordered-list": "Genel Liste",
        "ordered-list": "Numaralı Liste",
        "link": "Bağlantı Oluştur",
        "image": "Resim Ekle",
        "table": "Tablo Ekle",
        "horizontal-rule": "Yatay Çizgi Ekle",
        "preview": "Önizlemeyi Aç/Kapa",
        "side-by-side": "Yan Önizlemeyi Aç/Kapa",
        "fullscreen": "Tam Ekran Yap/Çık",
        "guide": "Rehber",
        "undo": "Geri Al",
        "redo": "İleri Al"
      },
      promptTexts: {
        link: "Bağlantı Adresi:",
        image: "Resim Bağlantısı:",
        def: "Tanımlanacak İsim:"
      },
      insertTexts: {
        table: ["", "\n\nBaşlık 1 | Başlık 2 | Başlık 3\n:--- | ---: | :---\nYazı | Yazı | Yazı\nYazı | Yazı | Yazı\n\n"]
      },
      spellChecker: false,
      promptURLs: true,
      autofocus: true,
      tabSize: 2,
      previewClassName: "markdown-body",
      renderingConfig: {
        singleLineBreaks: false,
        codeSyntaxHighlighting: true
      },
      previewRenderExtend: function(v) {
        /* Definition Lists*/
        v = v.replace(
          /^(<li>|<p>)(.*)\n:[\t| ](.*?[\S\s]*?)(<\/p>|<ul>|<\/li>)$/gmi,
          function myFunction(t, tag1, x, y, tag2){
            if(tag1 == '<p>') {
            tag1 = '';
            tag2 = '';
            }
            return tag1+'<dl><dt>'+x+'</dt><dd>'+y+'</dd></dl>'+tag2;
          }
        );
        /* Video */
        v = v.replace(
          /<a href="https:\/\/www.youtube.com\/embed\/(.*?)">https:\/\/www.youtube.com\/embed\/(.*?)<\/a>/gmi,
          function myFunction2(t, id) {
            return '<div class="r16_9"><iframe src="https://www.youtube.com/embed/'+id+'" frameborder="0" allowfullscreen> </iframe></div>';
          }
        );

        return v;
      }
    };
    if(this.props.isLoading)
      return (<div>Yükleniyor...</div>);

    let editor;
    if(this.state.checked)
      editor = <SimpleMDE options={simpleMDEOptions} onChange={(value) => this.props.updateEditor(value)} value={this.props.editor} />;
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
        <JFile path={this.props.input.input.imageFrom} visible={this.state.visible} value="" onChange={(v) => {
                let cm = this.state.editor.codemirror;
                let startPoint = cm.getCursor("start");
                let endPoint = cm.getCursor("end");
                let text = cm.getSelection();
                cm.replaceSelection(`![${text}](${this.props.input.input.imageTo}/${v})`);
                cm.setSelection(startPoint, endPoint);
                this.setState({ visible: !this.state.visible, editor });
              }}  />
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