import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Menu, Icon, Modal, Input, Button } from 'semantic-ui-react';

import { login } from '../../actions/tree';
import { setList } from '../../actions/documents';
import { commit } from '../../actions/save';

class Commit extends Component {
  constructor(props) {
    super(props);
    this.state = {active: false, modalActive: false, commitMessage: ""};
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.isLogin && this.state.active) {
      this.setState({ active: false });
      let path = this.props.path.substr(this.props.path.indexOf('/', 1) + 1);
      this.props.setList(path);
      this.setState({ modalActive: true });
      console.log("Güncelleme işlemi bitti.");
    }
  }

  commit = () => {
    this.setState({ modalActive: false });
    this.props.commit(this.state.commitMessage);
    console.log("Commit tamamlandı.");
  }

  handleCommit = () => {
    console.log("Güncelleme başlasın");
    this.props.login(this.props.token);
    this.setState({ active: true });
  }

  render() {
    let color = "green";
    switch(this.props.commitStatus) {
      case 1:
        color = "yellow";
        break;
      case 2:
        color = "green";
        break;
      case 3:
        color = "red";
        break;
    }
    return (
      <div>
        <Menu.Item title={this.props.commitError} disabled={color === "yellow" ? true:false} onClick={this.handleCommit} name="commit">
          <Icon name="upload" loading={color === "yellow" ? true:false} color={color} />
          Eşitle
        </Menu.Item>
        <Modal open={this.state.modalActive}>
          <Modal.Header>Eşitle</Modal.Header>
          <Modal.Content>
            <Input value={this.state.commitMessage} onChange={(e, data) => this.setState({ commitMessage: data.value })} fluid placeholder='Yaptığınız değişiklikler hakkında kısa bir not' />
          </Modal.Content>
          <Modal.Actions>
            <Button negative onClick={() => this.setState({ modalActive: false })}>Kapat</Button>
            <Button positive onClick={this.commit} labelPosition='right' icon='checkmark' content='Eşitle' />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

Commit.propTypes = {
};

const mapStateToProps = (state) => ({
  token: state.tree.token,
  isLogin: state.tree.isLogin,
  commitStatus: state.save.commitStatus,
  commitError: state.save.error,
  path: state.routing.locationBeforeTransitions.pathname
});

const mapDispatchToProps = (dispatch) => {
    return {
        login: (token, nextPath) => dispatch(login(token, nextPath)),
        setList: (v) => dispatch(setList(v)),
        commit: (v) => dispatch(commit(v))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Commit);