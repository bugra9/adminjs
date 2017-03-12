import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import jsyaml from 'js-yaml';
import { Sidebar, Menu, Image, Icon } from 'semantic-ui-react';

import Commit from '../compenents/commit';

class LeftSidebar extends Component {
  render() {
    let visible = this.props.visible;

    let menu;
    if(Object.keys(this.props.menu).length !== 0) {
      let arr = jsyaml.load(this.props.menu.file.content);
      menu = arr.map((value) => {
        return (
          <Menu.Item key={value.title} as={Link} to={value.url} name="post">
            <Icon name={value.icon} />
            {value.title}
          </Menu.Item>
        );
      });
    }
    else
      menu = (
        <div>
          <Menu.Item as={Link} to="/list/_posts" name="post">
            <Icon name="file text" />
            Yazı
          </Menu.Item>
          <Menu.Item as={Link} to="/list/" name="page">
            <Icon name="folder open outline" />
            Ana Dizin
          </Menu.Item>
        </div>
      );

    return (
        <Sidebar as={Menu} animation="push" width="thin" visible={visible} icon="labeled" color="violet" vertical inverted>
          <Image src="https://jekyllrb.com/img/logo-2x.png" />
          { menu }
          <Commit />
        </Sidebar>
    );
  }
}

LeftSidebar.propTypes = {
  visible: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  visible: state.system.sidebarVisible,
  menu: state.tree.menu
});

export default connect(mapStateToProps)(LeftSidebar);