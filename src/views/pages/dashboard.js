import React, { Component } from 'react';
import { Segment, Grid, Header, Icon } from 'semantic-ui-react';

class Dashboard extends Component {
  render() {
    return (
      <Segment color="violet" inverted basic>
        <Grid verticalAlign="middle" textAlign="center" style={{height: "100vh"}}>
          <Grid.Column>
            <Header as="h2" inverted icon size="medium">
              <Icon name="warning" />
              Bu sayfa daha oluşturulmamış. Sol menü ile diğer sayfaları ziyaret edebilirsiniz.
            </Header>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

export default Dashboard;
