import React, { Component } from 'react';
import { Row, Col, Glyphicon } from 'react-bootstrap';
import * as constants from 'utils/Constants';
import TableDetails from 'components/TableDetails';

const TableHeaders = ({tableData = []}) => {

  return tableData.map((item,index) => {
    return(
      <tbody>
        <tr key={index}>
          <td colSpan="2">
            {item.sourceField}
          </td>
          <td>
            {item.targetMatch ? <Glyphicon glyph="ok" /> : <Glyphicon glyph="remove" />}
          </td>
          <td>
            {item.targetField ? item.targetField : "N/A"}
          </td>
        </tr>
        {item.targetMatch ? 
          item.comparedProps.map((item,index) => <TableDetails item={item} key={index} />)
          : null}
      </tbody>
    );
  })  

}

export default TableHeaders;