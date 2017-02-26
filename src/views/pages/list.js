import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Menu, Icon, Breadcrumb, Container, Button, Grid, Table, Segment, Card } from 'semantic-ui-react';

import JInput from '../inputs';

import { sidebarToggle } from '../../actions/system';


class ListDocuments extends Component {
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
            <Icon name="circle" color={color} />
            <Icon name="remove" color="red" />
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
      let link = `${this.props.location.pathname}/${value}`;
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
    let sections = [];
    let link = "list";
    for(let value of this.props.location.pathname.substr(this.props.location.pathname.indexOf('/', 1) + 1).split('/')) {
      link += '/'+value;
      sections.push({ key: value, content: value, as: Link, to: link });
    }
    sections[sections.length-1].active = true;

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
              <Button compact basic>
                <Icon name="upload" />
                Belge Yükle
              </Button>
              <Button compact basic>
                <Icon name="folder" />
                Yeni Klasör
              </Button>
              <Button compact basic>
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
});

const mapDispatchToProps = (dispatch) => {
    return {
        sidebarToggle: () => dispatch(sidebarToggle())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListDocuments);
