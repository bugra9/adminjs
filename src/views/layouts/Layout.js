import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Sidebar } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.css';
import '../style.css';
// Components
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';

import { setList } from '../../actions/documents';

class Layout extends Component {
  componentDidMount() {
      let path = this.props.location.pathname.substr(this.props.location.pathname.indexOf('/', 1) + 1);
      this.props.setList(path);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.location.pathname !== this.props.location.pathname) {
      let path = nextProps.location.pathname.substr(nextProps.location.pathname.indexOf('/', 1) + 1);
      this.props.setList(path);
    }
  }

  render() {
    //console.log(this.props.all);
    return (
      <div className="app">
        <Sidebar.Pushable>
          <LeftSidebar />
          <Sidebar.Pusher>
            {this.props.children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        <RightSidebar />
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.element,
  setList: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  token: state.tree.token
});

const mapDispatchToProps = (dispatch) => {
    return {
        setList: (v) => dispatch(setList(v))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);