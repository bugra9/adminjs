import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { Menu, Icon, Grid, Segment, Header, Label, Form } from 'semantic-ui-react';

import JInput from '../inputs';

import { setList } from '../../actions/documents';
import { save } from '../../actions/save';

class EditDocuments extends Component {
  constructor(props) {
    super(props);
    this.state = {tabIndex: 1};
  }

  /*componentWillReceiveProps(nextProps) {
    if(Object.keys(nextProps.options).length === 0) {
      let path = nextProps.location.pathname.substr(nextProps.location.pathname.indexOf('/', 1) + 1);
      this.props.setList(path);
    }
  }*/

  handleSubmit = (e, { formData }) => {
    e.preventDefault();
    delete formData[''];
    for(let i in formData) {
      if(this.props.options[i] && this.props.options[i].input.type === "number")
        formData[i] = parseInt(formData[i]);
    }
    this.props.save(this.props.routeParams.splat, formData);
    hashHistory.goBack();
  }

  getDataAttr(v) {
    let temp = v.split('.');
    let attr = this.props.document;

    if(temp.length === 1)
      attr = attr.content;

    for(let value of temp)
      attr = attr[value];

    return attr;
  }

  defaultType(attr, value) {
    if(Array.isArray(value))
      return {
        attr: attr,
        title: attr,
        list: {
          show: true
        },
        edit: {},
        input: {
          type: "select",
          isRelated: false,
          multiple: true,
          options: []
        }
      };
    else if(typeof value === 'object')
      ;
    else
      return {
        attr: attr,
        title: attr,
        list: {
          show: true
        },
        edit: {},
        input: {
          type: "text"
        }
      };
  }

  render() {
    if(Object.keys(this.props.options).length === 0) {
      return(
        <div>a</div>
      );
    }
    let newFile = false;
    let attr = [[], [], [], []];
    attr[2].push('file.path');
    for(let i in this.props.document.content) {
      if(this.props.options[i] === undefined)
        attr[0].push(i);
      else if(this.props.options[i].edit.section !== undefined)
        attr[this.props.options[i].edit.section].push(i);
      else
        attr[1].push(i);
    }

    for(let i in this.props.options) {
      if(this.props.document.content[i] === undefined && this.props.options[i].edit !== undefined && ( this.props.options[i].edit.type === 2 || (this.props.options[i].edit.type === 1 && newFile)))
        if(this.props.options[i].edit.section !== undefined)
          attr[this.props.options[i].edit.section].push(i);
        else
          attr[1].push(i);
    }
    attr[1].sort((a, b) => { return (this.props.options[a].edit.order || 99) - (this.props.options[b].edit.order || 99); });

    let pos1 = [];
    for(let value of attr[1])
      pos1.push(<JInput key={value} input={this.props.options[value]} value={this.getDataAttr(value)} type="Input" />);

    let pos2 = [];
    for(let value of attr[2])
      pos2.push(<JInput key={value} input={this.props.options[value]} value={this.getDataAttr(value)} type="Input" />);

    let pos0 = [];
    for(let value of attr[0])
      pos0.push(<JInput key={value} input={this.defaultType(value, this.getDataAttr(value))} value={this.getDataAttr(value)} type="Input" />);

    let pos3 = [];
    for(let value of attr[3])
      pos3.push(<JInput key={value} input={this.props.options[value]} value={this.getDataAttr(value)} type="Input" />);

    return (
      <Form onSubmit={this.handleSubmit}>
        <Menu style={{"borderRadius": 0}} color="blue" inverted attached>
          <Menu.Item name="back" onClick={hashHistory.goBack}>
            <Icon name="left arrow" />
             Geri
          </Menu.Item>
          <Menu.Item position="right" className="bGreen" link header as="Button" type="submit">
            <Icon name="save" />
            KAYDET
          </Menu.Item>
        </Menu>

        <Menu widths="2" pointing secondary attached>
          <Menu.Item active={(this.state.tabIndex === 1)?true:false} onClick={() => this.setState({ tabIndex: 1 })}>Özellikler</Menu.Item>
          <Menu.Item active={(this.state.tabIndex === 2)?true:false} onClick={() => this.setState({ tabIndex: 2 })}>İçerik</Menu.Item>
        </Menu>
        <Segment attached="bottom" className={(this.state.tabIndex === 1) ? "": "hide"}>
          <Grid columns="equal">
            <Grid.Column>
              <Header as="h4" dividing>Genel Bilgiler</Header>
              {pos1}
            </Grid.Column>
            <Grid.Column>
              <Header as="h4" dividing>Yayınlama Bilgileri</Header>
              {pos2}
              <Grid columns="equal" verticalAlign="middle">
                <Grid.Column>
                  <Header as="h4" dividing>Özel Alanlar</Header>
                </Grid.Column>
                <Grid.Column textAlign="right">
                  <Label color="green" basic>
                    <Icon name="add" />
                     Giriş
                  </Label>
                  <Label color="orange" basic>
                    <Icon name="add" />
                     Dizi
                  </Label>
                  <Label color="blue" basic>
                    <Icon name="add" />
                     Nesne
                  </Label>
                </Grid.Column>
              </Grid>
              {pos0}
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment attached="bottom" className={(this.state.tabIndex === 2) ? "": "hide"}>
            {pos3}
        </Segment>
      </Form>
    );
  }
}

EditDocuments.propTypes = {
  token: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  setList: PropTypes.func.isRequired,
  variables: PropTypes.array.isRequired,
  options: PropTypes.object.isRequired,
  document: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  token: state.tree.token,
  options: state.documents.options,
  variables: state.documents.variables,
  document: state.documents.document,
  content: state.documents.content
});

const mapDispatchToProps = (dispatch) => {
    return {
        setList: (v) => dispatch(setList(v)),
        save: (path, data) => dispatch(save(path, data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditDocuments);