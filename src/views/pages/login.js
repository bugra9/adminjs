import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { Segment, Grid, Header, Image, Form, Input, Button, Dimmer, Message, Progress, Container } from 'semantic-ui-react';

import { login } from '../../actions/tree';

class Login extends Component {
  componentWillReceiveProps(nextProps) {
    if(nextProps.isLogin) {
      window.login = true;
      hashHistory.push(this.props.nextPath);
    }
  }

  handleSubmit = (e, { formData }) => {
    e.preventDefault();
    let nextPath = '';
    if(this.props && this.props.location && this.props.location.state && this.props.location.state.nextPath)
      nextPath = this.props.location.state.nextPath;
    else
      nextPath = "/";
    this.props.login(formData.token, nextPath);
  }

  render() {
    return (
      <Segment color="blue" inverted basic>
        <Grid verticalAlign="middle" textAlign="center" style={{height: "100vh"}}>
          <Grid.Column style={{width: 450}}>
            <Header as="h2" inverted image size="medium">
              <Image src="https://jekyllrb.com/img/logo-2x.png" size="large" />
              <Header.Content>
                AdminJS
              </Header.Content>
            </Header>
            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Message hidden={ !this.props.hasErrored } negative icon="x" header={ this.props.error } size="small" />
                <Form.Field>
                  <Input icon="lock" iconPosition="left" name="token" placeholder="Kişisel Erişim Anahtarı" />
                </Form.Field>
                <Button color="blue" size="large" fluid type="submit">Giriş</Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
        <Dimmer active={ this.props.isLoading }>
          <Container>
            <Progress percent={ this.props.progressPercent } inverted color="red" label indicating>
              { this.props.progressMessage }
            </Progress>
          </Container>
        </Dimmer>
      </Segment>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.tree.isLoading,
  isLogin: state.tree.isLogin,
  hasErrored: state.tree.hasErrored,
  error: state.tree.error,
  progressMessage: state.tree.progressMessage,
  progressPercent: state.tree.progressPercent,
  tree: state.tree.tree,
  message: state.tree.lastCommitMessage,
  nextPath: state.tree.nextPath
});

const mapDispatchToProps = (dispatch) => {
    return {
        login: (token, nextPath) => dispatch(login(token, nextPath))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
