import React, { Component } from 'react';
import { Sidebar, Segment, Button, Menu, Icon, Header, Form } from 'semantic-ui-react';


class RightSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }
  handleItemClick = () => this.setState({ visible: !this.state.visible })

  render() {
    const { visible } = this.state;
    return (
      <Sidebar animation="overlay" visible={visible} direction="right">
        <Menu style={{"borderRadius": 0}} color="violet" inverted>
          <Menu.Item name="backRightMenu" onClick={this.handleItemClick}>
            <Icon name="left arrow" />
            Geri
          </Menu.Item>
          <Menu.Item position="right">
            <Button color="green">Kaydet</Button>
          </Menu.Item>
        </Menu>
        <Segment basic>
          <Form>
            <Header as="h4" dividing>Kategori Ekle</Header>
            <Form.Field>
              <label>Başlık</label>
              <input name="name" placeholder="First Name" />
            </Form.Field>
          </Form>
        </Segment>
      </Sidebar>
    );
  }
}

export default RightSidebar;
