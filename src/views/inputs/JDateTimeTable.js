import React, { Component, PropTypes } from 'react';

class JDateTimeTable extends Component {
  render() {
    const {value} = this.props;
    let date = new Date(value);
    let month = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz",
              "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    let out = date.getDate() +' '+ month[date.getMonth()] +' '+ date.getFullYear();
    return (
      <td title={value}>{out}</td>
    );
  }
}

JDateTimeTable.propTypes = {
  input: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired
};

export default JDateTimeTable;