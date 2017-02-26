import React, { Component, PropTypes } from 'react';


class JTextTable extends Component {
  render() {
    const {value} = this.props;
    return (
      <td>{value}</td>
    );
  }
}

JTextTable.propTypes = {
  input: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired
};

export default JTextTable;