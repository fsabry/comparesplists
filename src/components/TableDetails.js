import React, { Component } from 'react';
import { Row, Col, Glyphicon } from 'react-bootstrap';
import * as constants from 'utils/Constants';

const TableDetails = ({item = {}}) => {

  return(
    <tr>
      <td>{item.prop}</td>
      <td>{item.source}</td>
      <td>{item.targetMatch ? <Glyphicon glyph="ok" /> : <Glyphicon glyph="remove" />}</td>
      <td>{item.target}</td>
    </tr>
  );

}

export default TableDetails;