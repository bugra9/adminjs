import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, Card, Icon, Sidebar, Menu, Button, Segment } from 'semantic-ui-react';
import fetch from 'isomorphic-fetch';

import { addFile } from '../../actions/save';

class JFile extends Component {
  constructor(props) {
    super(props);
    let path = props.path.split('/');
    let dir = props.tree;
    for(let p of path) {
      if(p[0] === ':')
        p = props.document.content[p.substr(1)];
      if(!dir[p])
        dir[p] = {};
      dir = dir[p];
    }
    for(let i in path)
      if(path[i][0] === ':') {
        if(props.document.content[path[i].substr(1)])
          path[i] = props.document.content[path[i].substr(1)];
      }
    path = path.join('/');

    this.state = {visible: false, value: props.value, dir, path, status: 0};
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.visible !== this.props.visible)
      this.setState({ visible: !this.state.visible });
  }

  handleClick = () => this.setState({ visible: !this.state.visible })

  handleFileChange = (e) => {
    let fileInput = e.target.files[0];
    if(!fileInput)
      return;

    let temp = Object.values(this.state.dir).concat(this.props.newFiles);
    for(let val of temp) {
      if(val.file.path.split('/').pop() === fileInput.name)
        return;
    }
    let reader = new FileReader();
    reader.readAsDataURL(fileInput);
    reader.onload = () => {
      this.setState({ status: 1 });
      let repo = window.repo.split('/');
      let token = this.props.token;
      let content = reader.result.split(',')[1];
      fetch(`https://api.github.com/repos/${repo[0]}/${repo[1]}/git/blobs`
        ,{ method: 'POST', body: JSON.stringify({encoding: "base64", content}), headers: { "Authorization": "Basic "+(new Buffer(":"+token).toString('base64'))} }
      )
        .then(res => res.json())
        .then(data => {
          this.props.addFile({
            file: {
              path: `${this.state.path}/${fileInput.name}`,
              sha: data.sha
            },
            content: {}
          });
          this.setState({ status: 0 });
        })
        .catch(error => {
          this.setState({ status: 2 });
          console.log(error.message);
        });
    };

    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  render() {
    let value = this.state.value;
    let visible = this.state.visible;

    let dir = this.state.dir;
    let files = Object.values(dir).concat(this.props.newFiles);

    files = files.map((val) => {
      let name = val.file.path.split('/').pop();
      let color = "blue";
      if(value === name)
        color = "red";
      return (
        <Card key={val.file.path} color={color} centered onClick={() => {this.setState({ value: name}); this.props.onChange(name); }}>
          <Card.Content className="center">
            <Icon name="file outline" size="huge" />
            <Card.Header>
              {name}
            </Card.Header>
          </Card.Content>
        </Card>
      );
    });
    let icon = "upload";
    if(this.state.status===1)
      icon = "upload";
    else if(this.state.status===2)
      icon = "warning";
    return (
      <Sidebar animation="overlay" visible={visible} direction="right">
        <Menu style={{"borderRadius": 0}} color="blue" inverted>
          <Menu.Item name="backRightMenu" onClick={this.handleClick}>
            <Icon name="left arrow" />
            Geri
          </Menu.Item>
          <Menu.Item position="right" className="bGreen" link header as="Button" type="button" onClick={() => this.fileInput.click()}>
            <input type="file" style={{display: "none"}} onChange={this.handleFileChange} ref={(input) => { this.fileInput = input; }} />
            <Icon loading={this.state.status===1?true:false} name={icon} />
            Yükle
          </Menu.Item>
        </Menu>
        <Segment basic>
          <Card.Group itemsPerRow="2" style={{"fontSize": "0.8em"}}>
            {files}
          </Card.Group>
        </Segment>
      </Sidebar>
    );
  }
}

JFile.propTypes = {
  value: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  tree: state.tree.tree,
  document: state.documents.document,
  newFiles: state.save.files,
  ff: state.save.filesLength,
  token: state.tree.token
});

const mapDispatchToProps = (dispatch) => {
    return {
        addFile: (v) => dispatch(addFile(v))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(JFile);