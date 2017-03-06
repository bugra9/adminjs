import React, { Component } from 'react';
import { Segment, Grid, Header, Icon } from 'semantic-ui-react';

class NotFound extends Component {
  render() {
    return (
      <Segment color="blue" inverted basic>
        <Grid verticalAlign="middle" textAlign="center" style={{height: "100vh"}}>
          <Grid.Column>
            <Header as="h2" inverted icon>
              <Icon name="warning" />
              Aradığınız sayfa bulunamadı.
            </Header>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

export default NotFound;
