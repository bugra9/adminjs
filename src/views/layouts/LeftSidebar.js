import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Sidebar, Menu, Image, Icon } from 'semantic-ui-react';

class LeftSidebar extends Component {
  render() {
    let visible = this.props.visible;
    return (
        <Sidebar as={Menu} animation="push" width="thin" visible={visible} icon="labeled" color="violet" vertical inverted>
          <Image src="https://jekyllrb.com/img/logo-2x.png" />
          <Menu.Item as={Link} to="/list/_posts" name="post">
            <Icon name="file text" />
            Yazı
          </Menu.Item>
          <Menu.Item as={Link} to="/list/_category" name="cat">
            <Icon name="sitemap" />
            Kategori
          </Menu.Item>
          <Menu.Item as={Link} to="/list/_tag" name="tag">
            <Icon name="tags" />
            Etiket
          </Menu.Item>
          <Menu.Item as={Link} to="/list/_other/author" name="author">
            <Icon name="user" />
            Yazar
          </Menu.Item>
          <Menu.Item as={Link} to="/list/_root" name="page">
            <Icon name="file" />
            Sayfa
          </Menu.Item>
          <Menu.Item as={Link} to="/list/assets" name="asset">
            <Icon name="image" />
            Dosya
          </Menu.Item>
          <Menu.Item as={Link} to="/settings" name="setting">
            <Icon name="setting" />
            Ayarlar
          </Menu.Item>
          <Menu.Item as={Link} to="/commit" name="commit">
            <Icon name="upload" />
            Eşitle
          </Menu.Item>
        </Sidebar>
    );
  }
}

LeftSidebar.propTypes = {
  visible: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  visible: state.system.sidebarVisible
});

export default connect(mapStateToProps)(LeftSidebar);