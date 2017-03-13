import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Menu, Icon, Breadcrumb, Container, Button, Grid, Table, Segment, Card } from 'semantic-ui-react';

import JInput from '../inputs';

import { sidebarToggle } from '../../actions/system';
import { toggle, remove } from '../../actions/save';


class ListDocuments extends Component {
  constructor(props) {
    super(props);
    this.state = {status: 0};
  }

  newDir = () => {
    let name = window.prompt("Lütfen yeni dizinin ismini giriniz.");
    if (name != null) {
      this.props.dir[name] = {};
      this.props.directories.push(name);
      this.forceUpdate();
    }
  }

  handleFileChange = (e) => {
    let fileInput = e.target.files[0];
    if(!fileInput)
      return;
    
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
          let obj = {
            file: {
              path: `${this.props.routeParams.splat}/${fileInput.name}`,
              sha: data.sha
            },
            content: {}
          };
          this.props.addBlob(obj);
          this.props.files.push(obj);
          this.props.dir[fileInput.name] = obj;
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

  renderTableHeader() {
    let cell = this.props.variables.map((value) => {
      let input = this.props.options[value];
      return (
        <Table.HeaderCell key={input.attr}>{ input.title }</Table.HeaderCell>
      );
    });
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell />
          {cell}
          <Table.HeaderCell>İşlemler</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  }

  renderTableBody() {
    let row = this.props.documents.map((value) => {
      if(value.file.path.split('/').pop() === '_admin_attr.yml')
        return;
      let link = '/edit/'+value.file.path;
      let cell = this.props.variables.map((variable) => {
        let input = this.props.options[variable];
        let key = value.file.path+'-'+input.attr;
        return (
          <JInput key={key} input={input} value={value.content[input.attr]} />
        );
      });
      let firstCellPath = "";
      if(this.props.variables.indexOf('title') === -1)
        firstCellPath = value.file.path.split('/').pop();

      let color = "green";
      if((value.file.path.split('/')).pop().substr(0,1) === '_')
        color = "red";
      return(
        <Table.Row key={value.file.path}>
          <Table.Cell title={value.file.path} collapsing>
            <Icon name="file outline" />
            { firstCellPath }
          </Table.Cell>
          { cell }
          <Table.Cell collapsing>
            <Link to={link}><Icon name="edit" /></Link>
            <Icon onClick={() => {this.props.toggle(value.file.path); this.forceUpdate();}} name="circle" color={color} />
            <Icon onClick={() => {this.props.remove(value.file.path); this.forceUpdate();}} name="remove" color="red" />
          </Table.Cell>
        </Table.Row>
      );
    });
    return (
      <Table.Body>
        { row }
      </Table.Body>
    );
  }

  renderDirectories() {
    return this.props.directories.map((value) => {
      let path = this.props.location.pathname;
      if(path[path.length-1] === '/')
        path = path.substr(0, path.length-1);
      let link = `${path}/${value}`;
      return (
        <Card centered key={value} as={Link} to={link}>
          <Card.Content className="center">
            <Icon name="folder" size="huge" />
            <Card.Header>
              { value }
            </Card.Header>
          </Card.Content>
        </Card>
      );
    });
  }

  renderFiles() {
    return this.props.files.map((value) => {
      let link = `https://raw.githubusercontent.com/ubuntu-tr/ubuntu-tr.github.io/master/${value.file.path}`;
      return (
        <Card centered key={value.file.path.split('/').pop()} as="A" href={link} target="_blank">
          <Card.Content className="center">
            <Icon name="file outline" size="huge" />
            <Card.Header>
              { value.file.path.split('/').pop() }
            </Card.Header>
          </Card.Content>
        </Card>
      );
    });
  }

  render() {
    let sections = [{ key: "/", content: "Ana Dizin", as: Link, to: "list/" }];
    let link = "list";
    for(let value of this.props.location.pathname.substr(this.props.location.pathname.indexOf('/', 1) + 1).split('/')) {
      link += '/'+value;
      sections.push({ key: value, content: value, as: Link, to: link });
    }
    sections[sections.length-1].active = true;

    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; //January is 0!
    let yyyy = today.getFullYear();

    if(dd<10) dd='0'+dd;
    if(mm<10) mm='0'+mm;

    let newDocLink = sections[sections.length-1].to.replace('list/', 'edit/');
    newDocLink += '/yeni.md';


    return (
      <div>
        <Menu style={{"borderRadius": 0}} color="blue" inverted>
          <Menu.Item name="menu" onClick={this.props.sidebarToggle}>
            <Icon name="sidebar" />
          </Menu.Item>
          <Menu.Item position="right">
            Admin Panel
          </Menu.Item>
        </Menu>
        <Container>
          <Grid columns="equal" verticalAlign="middle">
            <Grid.Column>
              <Breadcrumb sections={sections} />
            </Grid.Column>
            <Grid.Column textAlign="right">
              <Button compact basic onClick={() => this.fileInput.click()}>
                <input type="file" style={{display: "none"}} onChange={this.handleFileChange} ref={(input) => { this.fileInput = input; }} />
                <Icon loading={this.state.status===1?true:false} name="upload" />
                Dosya Yükle
              </Button>
              <Button compact basic onClick={this.newDir}>
                <Icon name="folder" />
                Yeni Dizin
              </Button>
              <Button as={Link} to={newDocLink} compact basic>
                <Icon name="file" />
                Yeni Belge
              </Button>
            </Grid.Column>
          </Grid>

          <Segment className={(this.props.directories.length+this.props.files.length === 0) ? "hide": ""}>
            <Card.Group itemsPerRow="7" doubling>
              { this.renderDirectories() }
              { this.renderFiles() }
            </Card.Group>
          </Segment>

          <Table celled striped className={(this.props.documents.length === 0) ? "hide": ""}>
            { this.renderTableHeader() }
            { this.renderTableBody() }
          </Table>
        </Container>
      </div>
    );
  }
}

ListDocuments.propTypes = {
  location: PropTypes.object.isRequired,
  sidebarToggle: PropTypes.func.isRequired,
  variables: PropTypes.array.isRequired,
  options: PropTypes.object.isRequired,
  documents: PropTypes.array.isRequired,
  files: PropTypes.array.isRequired,
  directories: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  options: state.documents.options,
  variables: state.documents.variables,
  documents: state.documents.documents,
  files: state.documents.files,
  directories: state.documents.directories,
  dir: state.documents.collections,
  token: state.tree.token
});

const mapDispatchToProps = (dispatch) => {
    return {
        sidebarToggle: () => dispatch(sidebarToggle()),
        toggle: (v) => dispatch(toggle(v)),
        remove: (v) => dispatch(remove(v)),
        addBlob: (obj) => dispatch({ type: 'ADD_DIFF', diff: { [obj.file.path]: {type: "addFile", obj } } })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListDocuments);
